var _functionsParser = require('./helperFunctions');

module.exports = {
    selectExpandParser: selectExpandParser,
    filterParser: filterParser,
    topParser: topParser,
    skipParser: skipParser,
    orderByParser: orderByParser
}

// need to look at: 
// http://localhost:8080/api/rooms?$select=_id,Name,MaxCapacity,RoomTypeId/_id,RoomTypeId/CreationUserId&$expand=RoomTypeId/CreationUserId/TenantId

function selectExpandParser(query, selected, expanded) {
    if (selected) {
        var selectedArray = selected.split(',');
        if (expanded) {
            var expandedArray = expanded.split(',').map(function (e) {
                return e.trim();
            });

            //build an object tree from the string. Select Tree in this case.
            var selectedTree = _functionsParser.buildTree(selected);

            //Invalid URL - Selecting something that is not expanded
            selectedArray.forEach(function (item) {
                if (item.indexOf('/') != -1 && expanded.indexOf(item.substring(0, item.lastIndexOf('/'))) == -1) {
                    throw 'Invalid URL - Selecting something that is not expanded';
                }
            });
            var validExpands = [];

            //Checking for Valid Expands
            expandedArray.forEach(function (expand) {
                var level = selectedTree;
                var expandPaths = expand.split('/');
                var validParts = [];

                //Checking each part of the expand seperated by '/' against the Select tree 
                expandPaths.every(function (part) {

                    //if defined in the current level
                    if (level[part]) {
                        level = level[part];

                        //if not defined check if it is on the base level
                    } else if (level === selectedTree) {
                        return false;

                        // if not check the current level is not empty
                    } else if (Object.keys(level).length != 0) {
                        return false;
                    }

                    validParts.push(part);
                    return true;
                });
                if (validParts.length > 0)
                    validExpands.push(validParts.join('.'));
            });

            //Create the options for deep populate. Selecting Properties of Expanded Objects
            var populateOptions = {};
            validExpands.forEach(function (path) {

                //Object.keys converts property names to an array.
                var subSelected = Object.keys(_functionsParser.getSubPaths(selectedTree, path) || {}).join(' ');
                if (subSelected) {
                    populateOptions[path] = {
                        path: path,
                        select: subSelected
                    }
                }
            });

            //create select String. Only consider the parts before the /
            var selectString = _functionsParser.unique(selectedArray.map(function (s) {
                return (s.indexOf('/') != -1) ? s.substring(0, s.indexOf('/')) : s;
            }));

            // Log the values. Used for debugging purposes.

            //return the query
            return query = query.select(selectString.join(' ')).deepPopulate(validExpands, {
                populate: populateOptions
            });
        } else {
            // check if something is selected with a slash (/) and is not expanded
            if (selected.indexOf('/') != -1)
                throw 'Entity is selected with a slash (/) and is not expanded.';

            return query.select(selectedArray.join(' '));
        }
    } else {
        if (expanded) {
            //covert / into a regex to replace all instances of it => replace(/\//g,'.')
            return query.deepPopulate(expanded.replace(/\//g, '.').split(','));
        }
    }
}

function filterParser(query, $filter) {
    if (!$filter) {
        return;
    }

    var SPLIT_MULTIPLE_CONDITIONS = /(.+?)(?:and(?=(?:[^']*'[^']*')*[^']*$)|$)/g;
    var SPLIT_KEY_OPERATOR_AND_VALUE = /(.+?)(?: (?=(?:[^']*'[^']*')*[^']*$)|$)/g;

    var condition = undefined;
    if (_functionsParser.stringHelper.has($filter, 'and')) {
        condition = $filter.match(SPLIT_MULTIPLE_CONDITIONS).map(function (s) {
            return _functionsParser.stringHelper.removeEndOf(s, 'and').trim();
        });
    } else {
        condition = [$filter.trim()];
    }

    for (var i = 0; i < condition.length; i++) {
        var item = condition[i];
        var conditionArr = item.match(SPLIT_KEY_OPERATOR_AND_VALUE).map(function (s) {
            return s.trim();
        }).filter(function (n) {
            return n;
        });
        if (conditionArr.length !== 3) {
            return new Error('Syntax error at \'#{item}\'.');
        }

        var _conditionArr = _functionsParser.slicedToArray(conditionArr, 3);

        var key = _conditionArr[0];
        var odataOperator = _conditionArr[1];
        var value = _conditionArr[2];

        value = _functionsParser.validator.formatValue(value);




        switch (odataOperator) {
            case 'eq':
                query.where(key).equals(value);
                break;
            case 'ne':
                query.where(key).ne(value);
                break;
            case 'gt':
                query.where(key).gt(value);
                break;
            case 'ge':
            case 'gte':
                query.where(key).gte(value);
                break;
            case 'lt':
                query.where(key).lt(value);
                break;
            case 'le':
            case 'lte':
                query.where(key).lte(value);
                break;
            default:
                return new Error('Incorrect operator at \'#{item}\'.');
        }
    }
    return query;
}

function topParser(query, top) {
    if (top > 0) {
        return query.limit(parseInt(top));
    } else
        return query;
}

function skipParser(query, skip) {
    if (skip > 0) {
        return query.skip(parseInt(skip));
    } else
        return query;
}

function orderByParser(query, orderBy) {
    if (!orderBy) {
        return;
    }

    var order = {};
    var orderbyArr = orderBy.split(',');

    orderbyArr.map(function (item) {
        var data = item.trim().split(' ');
        if (data.length > 2) {
            return new Error('odata: Syntax error at \'' + orderBy + '\', it should be like \'ReleaseDate asc, Rating desc\'');
        }
        var key = data[0].trim();
        var value = data[1] || 'asc';
        order[key] = value;
    });
    return query.sort(order);
}