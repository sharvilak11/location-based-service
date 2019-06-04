var config = require('../config');

var Location = require('../models/Location').model;

var kalmanFilter = require('./kalman');
var discardFilter = require('./discard');
var simplify = require('./simplify-js');
var helperFunctions = require('./helper');

// var rawData = [
//     {
//         Latitude: 51.4859726,
//         Longitude: -0.3103015,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646626855
//     },
//     {
//         Latitude: 51.4859,
//         Longitude: -0.31022,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646627861
//     },
//     {
//         Latitude: 51.48543,
//         Longitude: -0.30966,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646628866
//     },
//     {
//         Latitude: 51.4854302,
//         Longitude: -0.3096571,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646629870
//     },
//     {
//         Latitude: 51.48615,
//         Longitude: -0.30812,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646630872
//     },
//     {
//         Latitude: 51.48629,
//         Longitude: -0.30781,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646631875
//     },
//     {
//         Latitude: 51.4862851,
//         Longitude: -0.3078107,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646632879
//     },
//     {
//         Latitude: 51.48639,
//         Longitude: -0.30798,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646633883
//     },
//     {
//         Latitude: 51.48643,
//         Longitude: -0.30804,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646634887
//     },
//     {
//         Latitude: 51.48644,
//         Longitude: -0.30805,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646635893
//     },
//     {
//         Latitude: 51.48646,
//         Longitude: -0.30809,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646636899
//     },
//     {
//         Latitude: 51.48654,
//         Longitude: -0.30826,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646637901
//     },
//     {
//         Latitude: 51.4865381,
//         Longitude: -0.3082615,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646638906
//     },
//     {
//         Latitude: 51.48671,
//         Longitude: -0.30815,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646639907
//     },
//     {
//         Latitude: 51.48685,
//         Longitude: -0.30806,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646640909
//     },
//     {
//         Latitude: 51.48697,
//         Longitude: -0.30799,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646641912
//     },
//     {
//         Latitude: 51.48701,
//         Longitude: -0.30798,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646642916
//     },
//     {
//         Latitude: 51.48745,
//         Longitude: -0.30793,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646643920
//     },
//     {
//         Latitude: 51.48746,
//         Longitude: -0.30793,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646644924
//     },
//     {
//         Latitude: 51.48759,
//         Longitude: -0.30792,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646645925
//     },
//     {
//         Latitude: 51.48764,
//         Longitude: -0.30792,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646646928
//     },
//     {
//         Latitude: 51.48782,
//         Longitude: -0.30794,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646647932
//     },
//     {
//         Latitude: 51.48793,
//         Longitude: -0.30796,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646648937
//     },
//     {
//         Latitude: 51.48797,
//         Longitude: -0.30797,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646649940
//     },
//     {
//         Latitude: 51.48803,
//         Longitude: -0.30799,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646650944
//     },
//     {
//         Latitude: 51.48815,
//         Longitude: -0.30802,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646651950
//     },
//     {
//         Latitude: 51.48831,
//         Longitude: -0.30807,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646652954
//     },
//     {
//         Latitude: 51.48832,
//         Longitude: -0.30808,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646653958
//     },
//     {
//         Latitude: 51.48843,
//         Longitude: -0.30814,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646654963
//     },
//     {
//         Latitude: 51.48855,
//         Longitude: -0.3082,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646655968
//     },
//     {
//         Latitude: 51.48873,
//         Longitude: -0.3083,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646656971
//     },
//     {
//         Latitude: 51.48884,
//         Longitude: -0.30837,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646657976
//     },
//     {
//         Latitude: 51.48886,
//         Longitude: -0.30838,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646658979
//     },
//     {
//         Latitude: 51.48948,
//         Longitude: -0.30861,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646659983
//     },
//     {
//         Latitude: 51.48961,
//         Longitude: -0.3087,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646660987
//     },
//     {
//         Latitude: 51.48985,
//         Longitude: -0.30885,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646661991
//     },
//     {
//         Latitude: 51.4898482,
//         Longitude: -0.3088492,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646662993
//     },
//     {
//         Latitude: 51.49006,
//         Longitude: -0.30898,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646663993
//     },
//     {
//         Latitude: 51.49071,
//         Longitude: -0.30718,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646664998
//     },
//     {
//         Latitude: 51.49089,
//         Longitude: -0.30663,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646666004
//     },
//     {
//         Latitude: 51.49098,
//         Longitude: -0.30635,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646667008
//     },
//     {
//         Latitude: 51.49105,
//         Longitude: -0.30609,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646668014
//     },
//     {
//         Latitude: 51.49113,
//         Longitude: -0.3058,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646669018
//     },
//     {
//         Latitude: 51.4912,
//         Longitude: -0.30546,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646670020
//     },
//     {
//         Latitude: 51.49128,
//         Longitude: -0.30511,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646671020
//     },
//     {
//         Latitude: 51.49136,
//         Longitude: -0.30439,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646672025
//     },
//     {
//         Latitude: 51.4913588,
//         Longitude: -0.3043933,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646673028
//     },
//     {
//         Latitude: 51.49137,
//         Longitude: -0.30437,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646674032
//     },
//     {
//         Latitude: 51.49138,
//         Longitude: -0.30436,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646675035
//     },
//     {
//         Latitude: 51.49139,
//         Longitude: -0.30434,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646676040
//     },
//     {
//         Latitude: 51.4914,
//         Longitude: -0.30433,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646677042
//     },
//     {
//         Latitude: 51.49141,
//         Longitude: -0.30431,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646678048
//     },
//     {
//         Latitude: 51.49142,
//         Longitude: -0.30429,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646679052
//     },
//     {
//         Latitude: 51.49143,
//         Longitude: -0.30425,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646680055
//     },
//     {
//         Latitude: 51.49146,
//         Longitude: -0.30417,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646681060
//     },
//     {
//         Latitude: 51.49146,
//         Longitude: -0.3041,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646682065
//     },
//     {
//         Latitude: 51.49146,
//         Longitude: -0.30407,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646683069
//     },
//     {
//         Latitude: 51.49146,
//         Longitude: -0.30404,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646684074
//     },
//     {
//         Latitude: 51.49146,
//         Longitude: -0.30403,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646685076
//     },
//     {
//         Latitude: 51.49145,
//         Longitude: -0.304,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646686080
//     },
//     {
//         Latitude: 51.49145,
//         Longitude: -0.30399,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646687086
//     },
//     {
//         Latitude: 51.49145,
//         Longitude: -0.30397,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646688091
//     },
//     {
//         Latitude: 51.49144,
//         Longitude: -0.30395,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646689095
//     },
//     {
//         Latitude: 51.49144,
//         Longitude: -0.30393,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646690098
//     },
//     {
//         Latitude: 51.49143,
//         Longitude: -0.30392,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646691103
//     },
//     {
//         Latitude: 51.49142,
//         Longitude: -0.3039,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646692104
//     },
//     {
//         Latitude: 51.49142,
//         Longitude: -0.30388,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646693106
//     },
//     {
//         Latitude: 51.49144,
//         Longitude: -0.30353,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646694108
//     },
//     {
//         Latitude: 51.49145,
//         Longitude: -0.30335,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646695112
//     },
//     {
//         Latitude: 51.49148,
//         Longitude: -0.3027,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646696116
//     },
//     {
//         Latitude: 51.49153,
//         Longitude: -0.29961,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646697117
//     },
//     {
//         Latitude: 51.49153,
//         Longitude: -0.29917,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646698122
//     },
//     {
//         Latitude: 51.49154,
//         Longitude: -0.29897,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646699127
//     },
//     {
//         Latitude: 51.49155,
//         Longitude: -0.29863,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646700132
//     },
//     {
//         Latitude: 51.4915454,
//         Longitude: -0.2986311,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646701134
//     },
//     {
//         Latitude: 51.49158,
//         Longitude: -0.29832,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646702136
//     },
//     {
//         Latitude: 51.4916,
//         Longitude: -0.29749,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646703142
//     },
//     {
//         Latitude: 51.49161,
//         Longitude: -0.29712,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646704148
//     },
//     {
//         Latitude: 51.49161,
//         Longitude: -0.29681,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646705153
//     },
//     {
//         Latitude: 51.4916,
//         Longitude: -0.29568,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646706153
//     },
//     {
//         Latitude: 51.49159,
//         Longitude: -0.29506,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646707156
//     },
//     {
//         Latitude: 51.49158,
//         Longitude: -0.29467,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646708159
//     },
//     {
//         Latitude: 51.49148,
//         Longitude: -0.29387,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646709163
//     },
//     {
//         Latitude: 51.49144,
//         Longitude: -0.29337,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646710167
//     },
//     {
//         Latitude: 51.4914,
//         Longitude: -0.29312,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646711171
//     },
//     {
//         Latitude: 51.4914028,
//         Longitude: -0.2931244,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646712172
//     },
//     {
//         Latitude: 51.49143,
//         Longitude: -0.29263,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646713176
//     },
//     {
//         Latitude: 51.49144,
//         Longitude: -0.29249,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646714181
//     },
//     {
//         Latitude: 51.49146,
//         Longitude: -0.29235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646715185
//     },
//     {
//         Latitude: 51.49148,
//         Longitude: -0.29219,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646716187
//     },
//     {
//         Latitude: 51.49151,
//         Longitude: -0.29202,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646717192
//     },
//     {
//         Latitude: 51.49153,
//         Longitude: -0.2919,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646718197
//     },
//     {
//         Latitude: 51.49156,
//         Longitude: -0.29177,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646719200
//     },
//     {
//         Latitude: 51.49161,
//         Longitude: -0.29159,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646720201
//     },
//     {
//         Latitude: 51.49165,
//         Longitude: -0.29146,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646721203
//     },
//     {
//         Latitude: 51.4917,
//         Longitude: -0.2913,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646722208
//     },
//     {
//         Latitude: 51.4918,
//         Longitude: -0.29101,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646723209
//     },
//     {
//         Latitude: 51.492,
//         Longitude: -0.29045,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646724214
//     },
//     {
//         Latitude: 51.49223,
//         Longitude: -0.28982,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646725217
//     },
//     {
//         Latitude: 51.49262,
//         Longitude: -0.28876,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646726223
//     },
//     {
//         Latitude: 51.49274,
//         Longitude: -0.28841,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646727225
//     },
//     {
//         Latitude: 51.49281,
//         Longitude: -0.28818,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646728231
//     },
//     {
//         Latitude: 51.49285,
//         Longitude: -0.28803,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646729237
//     },
//     {
//         Latitude: 51.49287,
//         Longitude: -0.2879,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646730242
//     },
//     {
//         Latitude: 51.4929,
//         Longitude: -0.28778,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646731244
//     },
//     {
//         Latitude: 51.49292,
//         Longitude: -0.28761,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646732244
//     },
//     {
//         Latitude: 51.49293,
//         Longitude: -0.28748,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646733250
//     },
//     {
//         Latitude: 51.49294,
//         Longitude: -0.28734,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646734250
//     },
//     {
//         Latitude: 51.49294,
//         Longitude: -0.28718,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646735253
//     },
//     {
//         Latitude: 51.49293,
//         Longitude: -0.28698,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646736256
//     },
//     {
//         Latitude: 51.49291,
//         Longitude: -0.28678,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646737260
//     },
//     {
//         Latitude: 51.49288,
//         Longitude: -0.28658,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646738265
//     },
//     {
//         Latitude: 51.49283,
//         Longitude: -0.28629,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646739270
//     },
//     {
//         Latitude: 51.49267,
//         Longitude: -0.28544,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646740272
//     },
//     {
//         Latitude: 51.49259,
//         Longitude: -0.28504,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646741278
//     },
//     {
//         Latitude: 51.49254,
//         Longitude: -0.28483,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646742280
//     },
//     {
//         Latitude: 51.49247,
//         Longitude: -0.28455,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646743285
//     },
//     {
//         Latitude: 51.49238,
//         Longitude: -0.28423,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646744289
//     },
//     {
//         Latitude: 51.49234,
//         Longitude: -0.2841,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646745293
//     },
//     {
//         Latitude: 51.49229,
//         Longitude: -0.28394,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646746296
//     },
//     {
//         Latitude: 51.49218,
//         Longitude: -0.28365,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646747297
//     },
//     {
//         Latitude: 51.49209,
//         Longitude: -0.28343,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646748302
//     },
//     {
//         Latitude: 51.49194,
//         Longitude: -0.28308,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646749307
//     },
//     {
//         Latitude: 51.4918,
//         Longitude: -0.28276,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646750311
//     },
//     {
//         Latitude: 51.49163,
//         Longitude: -0.28239,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646751316
//     },
//     {
//         Latitude: 51.49155,
//         Longitude: -0.28222,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646752320
//     },
//     {
//         Latitude: 51.49147,
//         Longitude: -0.28204,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646753322
//     },
//     {
//         Latitude: 51.49146,
//         Longitude: -0.28203,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646754327
//     },
//     {
//         Latitude: 51.49128,
//         Longitude: -0.28162,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646755330
//     },
//     {
//         Latitude: 51.49091,
//         Longitude: -0.28081,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646756333
//     },
//     {
//         Latitude: 51.4904,
//         Longitude: -0.27968,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646757337
//     },
//     {
//         Latitude: 51.49026,
//         Longitude: -0.27939,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646758337
//     },
//     {
//         Latitude: 51.4902,
//         Longitude: -0.27926,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646759340
//     },
//     {
//         Latitude: 51.49011,
//         Longitude: -0.27905,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646760341
//     },
//     {
//         Latitude: 51.48996,
//         Longitude: -0.27867,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646761345
//     },
//     {
//         Latitude: 51.48976,
//         Longitude: -0.27813,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646762346
//     },
//     {
//         Latitude: 51.48969,
//         Longitude: -0.27793,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646763347
//     },
//     {
//         Latitude: 51.48961,
//         Longitude: -0.2777,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646764351
//     },
//     {
//         Latitude: 51.4896104,
//         Longitude: -0.2777004,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646765357
//     },
//     {
//         Latitude: 51.48948,
//         Longitude: -0.27733,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646766358
//     },
//     {
//         Latitude: 51.48935,
//         Longitude: -0.27695,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646767360
//     },
//     {
//         Latitude: 51.48933,
//         Longitude: -0.2769,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646768363
//     },
//     {
//         Latitude: 51.48931,
//         Longitude: -0.27685,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646769366
//     },
//     {
//         Latitude: 51.48909,
//         Longitude: -0.27624,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646770372
//     },
//     {
//         Latitude: 51.48908,
//         Longitude: -0.2762,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646771376
//     },
//     {
//         Latitude: 51.489,
//         Longitude: -0.27593,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646772380
//     },
//     {
//         Latitude: 51.48892,
//         Longitude: -0.27564,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646773383
//     },
//     {
//         Latitude: 51.48877,
//         Longitude: -0.27492,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646774387
//     },
//     {
//         Latitude: 51.48854,
//         Longitude: -0.27386,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646775391
//     },
//     {
//         Latitude: 51.48848,
//         Longitude: -0.27357,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646776394
//     },
//     {
//         Latitude: 51.48847,
//         Longitude: -0.27351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646777398
//     },
//     {
//         Latitude: 51.48839,
//         Longitude: -0.27308,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646778401
//     },
//     {
//         Latitude: 51.48833,
//         Longitude: -0.27261,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646779403
//     },
//     {
//         Latitude: 51.48831,
//         Longitude: -0.27234,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646780407
//     },
//     {
//         Latitude: 51.48829,
//         Longitude: -0.27205,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646781410
//     },
//     {
//         Latitude: 51.48822,
//         Longitude: -0.27103,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646782413
//     },
//     {
//         Latitude: 51.48821,
//         Longitude: -0.27082,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646783414
//     },
//     {
//         Latitude: 51.4882,
//         Longitude: -0.27067,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646784417
//     },
//     {
//         Latitude: 51.48818,
//         Longitude: -0.27054,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646785421
//     },
//     {
//         Latitude: 51.48813,
//         Longitude: -0.27018,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646786425
//     },
//     {
//         Latitude: 51.48798,
//         Longitude: -0.26937,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646787431
//     },
//     {
//         Latitude: 51.48784,
//         Longitude: -0.26875,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646788436
//     },
//     {
//         Latitude: 51.48776,
//         Longitude: -0.26829,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646789439
//     },
//     {
//         Latitude: 51.48773,
//         Longitude: -0.26808,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646790444
//     },
//     {
//         Latitude: 51.48772,
//         Longitude: -0.26791,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646791448
//     },
//     {
//         Latitude: 51.4877,
//         Longitude: -0.26758,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646792449
//     },
//     {
//         Latitude: 51.4877,
//         Longitude: -0.26738,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646793452
//     },
//     {
//         Latitude: 51.48769,
//         Longitude: -0.26713,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646794454
//     },
//     {
//         Latitude: 51.48769,
//         Longitude: -0.26687,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646795458
//     },
//     {
//         Latitude: 51.48768,
//         Longitude: -0.26654,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646796463
//     },
//     {
//         Latitude: 51.48768,
//         Longitude: -0.26615,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646797467
//     },
//     {
//         Latitude: 51.48767,
//         Longitude: -0.26602,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646798470
//     },
//     {
//         Latitude: 51.48767,
//         Longitude: -0.26563,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646799476
//     },
//     {
//         Latitude: 51.48767,
//         Longitude: -0.26387,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646800480
//     },
//     {
//         Latitude: 51.48766,
//         Longitude: -0.26168,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646801485
//     },
//     {
//         Latitude: 51.48766,
//         Longitude: -0.26056,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646802489
//     },
//     {
//         Latitude: 51.48767,
//         Longitude: -0.25876,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646803494
//     },
//     {
//         Latitude: 51.48767,
//         Longitude: -0.25869,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646804497
//     },
//     {
//         Latitude: 51.48767,
//         Longitude: -0.25857,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646805502
//     },
//     {
//         Latitude: 51.48767,
//         Longitude: -0.25851,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646806504
//     },
//     {
//         Latitude: 51.48766,
//         Longitude: -0.25831,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646807505
//     },
//     {
//         Latitude: 51.48765,
//         Longitude: -0.25817,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646808510
//     },
//     {
//         Latitude: 51.48764,
//         Longitude: -0.25803,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646809514
//     },
//     {
//         Latitude: 51.48763,
//         Longitude: -0.25789,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646810517
//     },
//     {
//         Latitude: 51.48761,
//         Longitude: -0.25759,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646811518
//     },
//     {
//         Latitude: 51.48759,
//         Longitude: -0.25738,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646812521
//     },
//     {
//         Latitude: 51.48755,
//         Longitude: -0.25693,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646813527
//     },
//     {
//         Latitude: 51.48749,
//         Longitude: -0.25651,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646814533
//     },
//     {
//         Latitude: 51.48743,
//         Longitude: -0.25608,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646815538
//     },
//     {
//         Latitude: 51.48733,
//         Longitude: -0.25545,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646816542
//     },
//     {
//         Latitude: 51.48716,
//         Longitude: -0.25437,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646817546
//     },
//     {
//         Latitude: 51.48708,
//         Longitude: -0.2537,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646818550
//     },
//     {
//         Latitude: 51.48707,
//         Longitude: -0.2536,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646819552
//     },
//     {
//         Latitude: 51.48706,
//         Longitude: -0.25348,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646820554
//     },
//     {
//         Latitude: 51.48706,
//         Longitude: -0.2534,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646821557
//     },
//     {
//         Latitude: 51.48706,
//         Longitude: -0.25333,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646822562
//     },
//     {
//         Latitude: 51.48707,
//         Longitude: -0.25324,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646823564
//     },
//     {
//         Latitude: 51.48708,
//         Longitude: -0.25316,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646824566
//     },
//     {
//         Latitude: 51.4871,
//         Longitude: -0.25309,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646825567
//     },
//     {
//         Latitude: 51.48711,
//         Longitude: -0.25303,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646826569
//     },
//     {
//         Latitude: 51.48713,
//         Longitude: -0.25296,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646827572
//     },
//     {
//         Latitude: 51.48715,
//         Longitude: -0.2529,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646828575
//     },
//     {
//         Latitude: 51.48718,
//         Longitude: -0.25283,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646829581
//     },
//     {
//         Latitude: 51.4871756,
//         Longitude: -0.2528308,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646830585
//     },
//     {
//         Latitude: 51.48723,
//         Longitude: -0.2527,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646831590
//     },
//     {
//         Latitude: 51.48725,
//         Longitude: -0.25262,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646832592
//     },
//     {
//         Latitude: 51.48726,
//         Longitude: -0.25255,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646833596
//     },
//     {
//         Latitude: 51.48729,
//         Longitude: -0.25243,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646834600
//     },
//     {
//         Latitude: 51.4873,
//         Longitude: -0.2523,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646835603
//     },
//     {
//         Latitude: 51.48731,
//         Longitude: -0.25212,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646836607
//     },
//     {
//         Latitude: 51.48733,
//         Longitude: -0.252,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646837608
//     },
//     {
//         Latitude: 51.48734,
//         Longitude: -0.25195,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646838609
//     },
//     {
//         Latitude: 51.48736,
//         Longitude: -0.2519,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646839612
//     },
//     {
//         Latitude: 51.4874,
//         Longitude: -0.25177,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646840614
//     },
//     {
//         Latitude: 51.48749,
//         Longitude: -0.25158,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646841618
//     },
//     {
//         Latitude: 51.48764,
//         Longitude: -0.25126,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646842623
//     },
//     {
//         Latitude: 51.48784,
//         Longitude: -0.25085,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646843625
//     },
//     {
//         Latitude: 51.48801,
//         Longitude: -0.25049,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646844626
//     },
//     {
//         Latitude: 51.48816,
//         Longitude: -0.25016,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646845630
//     },
//     {
//         Latitude: 51.48846,
//         Longitude: -0.24947,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646846632
//     },
//     {
//         Latitude: 51.48924,
//         Longitude: -0.24754,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646847636
//     },
//     {
//         Latitude: 51.48937,
//         Longitude: -0.24721,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646848637
//     },
//     {
//         Latitude: 51.48946,
//         Longitude: -0.24694,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646849639
//     },
//     {
//         Latitude: 51.48959,
//         Longitude: -0.24662,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646850644
//     },
//     {
//         Latitude: 51.48968,
//         Longitude: -0.24644,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646851645
//     },
//     {
//         Latitude: 51.48977,
//         Longitude: -0.24621,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646852649
//     },
//     {
//         Latitude: 51.48999,
//         Longitude: -0.24567,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646853652
//     },
//     {
//         Latitude: 51.49009,
//         Longitude: -0.24542,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646854655
//     },
//     {
//         Latitude: 51.49025,
//         Longitude: -0.245,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646855656
//     },
//     {
//         Latitude: 51.49031,
//         Longitude: -0.24482,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646856658
//     },
//     {
//         Latitude: 51.49039,
//         Longitude: -0.24458,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646857659
//     },
//     {
//         Latitude: 51.49045,
//         Longitude: -0.2444,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646858660
//     },
//     {
//         Latitude: 51.49054,
//         Longitude: -0.24409,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646859661
//     },
//     {
//         Latitude: 51.49062,
//         Longitude: -0.24381,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646860664
//     },
//     {
//         Latitude: 51.49072,
//         Longitude: -0.24341,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646861667
//     },
//     {
//         Latitude: 51.49078,
//         Longitude: -0.24313,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646862671
//     },
//     {
//         Latitude: 51.49083,
//         Longitude: -0.24294,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646863675
//     },
//     {
//         Latitude: 51.49085,
//         Longitude: -0.24287,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646864678
//     },
//     {
//         Latitude: 51.49087,
//         Longitude: -0.24277,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646865680
//     },
//     {
//         Latitude: 51.49096,
//         Longitude: -0.2424,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646866681
//     },
//     {
//         Latitude: 51.49097,
//         Longitude: -0.24233,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646867681
//     },
//     {
//         Latitude: 51.49104,
//         Longitude: -0.24207,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646868681
//     },
//     {
//         Latitude: 51.49114,
//         Longitude: -0.24167,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646869685
//     },
//     {
//         Latitude: 51.4912,
//         Longitude: -0.24139,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646870685
//     },
//     {
//         Latitude: 51.49125,
//         Longitude: -0.24112,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646871688
//     },
//     {
//         Latitude: 51.49128,
//         Longitude: -0.24091,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646872692
//     },
//     {
//         Latitude: 51.49128,
//         Longitude: -0.2409,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646873696
//     },
//     {
//         Latitude: 51.49131,
//         Longitude: -0.24068,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646874701
//     },
//     {
//         Latitude: 51.49133,
//         Longitude: -0.24049,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646875705
//     },
//     {
//         Latitude: 51.49135,
//         Longitude: -0.24028,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646876709
//     },
//     {
//         Latitude: 51.49136,
//         Longitude: -0.24012,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646877710
//     },
//     {
//         Latitude: 51.49137,
//         Longitude: -0.23993,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646878714
//     },
//     {
//         Latitude: 51.49138,
//         Longitude: -0.23967,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646879719
//     },
//     {
//         Latitude: 51.49138,
//         Longitude: -0.23964,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646880722
//     },
//     {
//         Latitude: 51.49139,
//         Longitude: -0.23926,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646881727
//     },
//     {
//         Latitude: 51.49139,
//         Longitude: -0.23915,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646882732
//     },
//     {
//         Latitude: 51.49142,
//         Longitude: -0.23775,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646883737
//     },
//     {
//         Latitude: 51.49143,
//         Longitude: -0.23755,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646884738
//     },
//     {
//         Latitude: 51.49142,
//         Longitude: -0.23731,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646885741
//     },
//     {
//         Latitude: 51.4914,
//         Longitude: -0.23675,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646886744
//     },
//     {
//         Latitude: 51.49139,
//         Longitude: -0.23624,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646887748
//     },
//     {
//         Latitude: 51.49138,
//         Longitude: -0.23595,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646888753
//     },
//     {
//         Latitude: 51.49137,
//         Longitude: -0.23568,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646889755
//     },
//     {
//         Latitude: 51.49136,
//         Longitude: -0.23549,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646890756
//     },
//     {
//         Latitude: 51.49134,
//         Longitude: -0.23521,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646891761
//     },
//     {
//         Latitude: 51.49133,
//         Longitude: -0.23507,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646892765
//     },
//     {
//         Latitude: 51.49128,
//         Longitude: -0.23452,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646893768
//     },
//     {
//         Latitude: 51.49123,
//         Longitude: -0.23407,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646894772
//     },
//     {
//         Latitude: 51.49118,
//         Longitude: -0.23354,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646895775
//     },
//     {
//         Latitude: 51.49106,
//         Longitude: -0.23222,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646896781
//     },
//     {
//         Latitude: 51.4910588,
//         Longitude: -0.2322176,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646897782
//     },
//     {
//         Latitude: 51.49107,
//         Longitude: -0.23213,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646898783
//     },
//     {
//         Latitude: 51.49107,
//         Longitude: -0.2321,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646899789
//     },
//     {
//         Latitude: 51.49107,
//         Longitude: -0.23202,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646900791
//     },
//     {
//         Latitude: 51.49107,
//         Longitude: -0.23197,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646901791
//     },
//     {
//         Latitude: 51.49106,
//         Longitude: -0.23182,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646902795
//     },
//     {
//         Latitude: 51.49106,
//         Longitude: -0.23165,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646903798
//     },
//     {
//         Latitude: 51.49105,
//         Longitude: -0.2315,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646904803
//     },
//     {
//         Latitude: 51.49106,
//         Longitude: -0.23135,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646905806
//     },
//     {
//         Latitude: 51.49106,
//         Longitude: -0.23124,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646906807
//     },
//     {
//         Latitude: 51.49107,
//         Longitude: -0.23106,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646907809
//     },
//     {
//         Latitude: 51.49109,
//         Longitude: -0.23062,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646908812
//     },
//     {
//         Latitude: 51.49111,
//         Longitude: -0.23033,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646909815
//     },
//     {
//         Latitude: 51.49111,
//         Longitude: -0.2302,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646910818
//     },
//     {
//         Latitude: 51.49112,
//         Longitude: -0.22974,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646911822
//     },
//     {
//         Latitude: 51.49113,
//         Longitude: -0.22963,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646912826
//     },
//     {
//         Latitude: 51.49116,
//         Longitude: -0.22933,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646913831
//     },
//     {
//         Latitude: 51.4912,
//         Longitude: -0.22895,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646914835
//     },
//     {
//         Latitude: 51.49125,
//         Longitude: -0.22852,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646915840
//     },
//     {
//         Latitude: 51.4912459,
//         Longitude: -0.2285238,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646916844
//     },
//     {
//         Latitude: 51.49126,
//         Longitude: -0.22835,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646917848
//     },
//     {
//         Latitude: 51.49131,
//         Longitude: -0.22806,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646918852
//     },
//     {
//         Latitude: 51.49136,
//         Longitude: -0.22773,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646919855
//     },
//     {
//         Latitude: 51.49139,
//         Longitude: -0.22757,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646920859
//     },
//     {
//         Latitude: 51.49144,
//         Longitude: -0.22742,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646921859
//     },
//     {
//         Latitude: 51.49146,
//         Longitude: -0.22732,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646922863
//     },
//     {
//         Latitude: 51.49149,
//         Longitude: -0.22723,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646923867
//     },
//     {
//         Latitude: 51.49161,
//         Longitude: -0.22698,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646924872
//     },
//     {
//         Latitude: 51.49165,
//         Longitude: -0.22691,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646925876
//     },
//     {
//         Latitude: 51.49174,
//         Longitude: -0.22674,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646926882
//     },
//     {
//         Latitude: 51.49189,
//         Longitude: -0.22648,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646927885
//     },
//     {
//         Latitude: 51.49191,
//         Longitude: -0.22645,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646928889
//     },
//     {
//         Latitude: 51.49199,
//         Longitude: -0.22628,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646929893
//     },
//     {
//         Latitude: 51.49203,
//         Longitude: -0.2262,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646930895
//     },
//     {
//         Latitude: 51.49206,
//         Longitude: -0.22613,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646931900
//     },
//     {
//         Latitude: 51.49209,
//         Longitude: -0.22605,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646932905
//     },
//     {
//         Latitude: 51.4921,
//         Longitude: -0.22597,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646933909
//     },
//     {
//         Latitude: 51.49212,
//         Longitude: -0.22588,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646934911
//     },
//     {
//         Latitude: 51.49214,
//         Longitude: -0.22572,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646935912
//     },
//     {
//         Latitude: 51.49215,
//         Longitude: -0.22562,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646936917
//     },
//     {
//         Latitude: 51.49215,
//         Longitude: -0.22554,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646937919
//     },
//     {
//         Latitude: 51.49215,
//         Longitude: -0.22527,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646938924
//     },
//     {
//         Latitude: 51.49215,
//         Longitude: -0.22516,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646939928
//     },
//     {
//         Latitude: 51.49214,
//         Longitude: -0.22511,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646940933
//     },
//     {
//         Latitude: 51.49215,
//         Longitude: -0.22509,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646941938
//     },
//     {
//         Latitude: 51.49215,
//         Longitude: -0.22508,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646942942
//     },
//     {
//         Latitude: 51.49215,
//         Longitude: -0.22507,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646943944
//     },
//     {
//         Latitude: 51.49215,
//         Longitude: -0.22506,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646944947
//     },
//     {
//         Latitude: 51.49216,
//         Longitude: -0.22504,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646945950
//     },
//     {
//         Latitude: 51.49217,
//         Longitude: -0.225,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646946954
//     },
//     {
//         Latitude: 51.4922,
//         Longitude: -0.22495,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646947958
//     },
//     {
//         Latitude: 51.49223,
//         Longitude: -0.22491,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646948963
//     },
//     {
//         Latitude: 51.49224,
//         Longitude: -0.2249,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646949965
//     },
//     {
//         Latitude: 51.49227,
//         Longitude: -0.22487,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646950970
//     },
//     {
//         Latitude: 51.49236,
//         Longitude: -0.22482,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646951974
//     },
//     {
//         Latitude: 51.4923582,
//         Longitude: -0.2248216,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646952979
//     },
//     {
//         Latitude: 51.49269,
//         Longitude: -0.22482,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646953983
//     },
//     {
//         Latitude: 51.49275,
//         Longitude: -0.22481,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646954985
//     },
//     {
//         Latitude: 51.4927483,
//         Longitude: -0.2248116,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646955986
//     },
//     {
//         Latitude: 51.49286,
//         Longitude: -0.22473,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646956990
//     },
//     {
//         Latitude: 51.49291,
//         Longitude: -0.2247,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646957994
//     },
//     {
//         Latitude: 51.49293,
//         Longitude: -0.22468,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646958998
//     },
//     {
//         Latitude: 51.49294,
//         Longitude: -0.22467,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646960004
//     },
//     {
//         Latitude: 51.49298,
//         Longitude: -0.22462,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646961006
//     },
//     {
//         Latitude: 51.49301,
//         Longitude: -0.22457,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646962011
//     },
//     {
//         Latitude: 51.49306,
//         Longitude: -0.22446,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646963015
//     },
//     {
//         Latitude: 51.4930594,
//         Longitude: -0.2244573,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646964017
//     },
//     {
//         Latitude: 51.49308,
//         Longitude: -0.22437,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646965018
//     },
//     {
//         Latitude: 51.4931,
//         Longitude: -0.22429,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646966023
//     },
//     {
//         Latitude: 51.49311,
//         Longitude: -0.22417,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646967028
//     },
//     {
//         Latitude: 51.49312,
//         Longitude: -0.22404,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646968032
//     },
//     {
//         Latitude: 51.49313,
//         Longitude: -0.22398,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646969034
//     },
//     {
//         Latitude: 51.49313,
//         Longitude: -0.22393,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646970037
//     },
//     {
//         Latitude: 51.49313,
//         Longitude: -0.22387,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646971040
//     },
//     {
//         Latitude: 51.49313,
//         Longitude: -0.22383,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646972044
//     },
//     {
//         Latitude: 51.49313,
//         Longitude: -0.22379,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646973048
//     },
//     {
//         Latitude: 51.49313,
//         Longitude: -0.22372,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646974052
//     },
//     {
//         Latitude: 51.49313,
//         Longitude: -0.22366,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646975057
//     },
//     {
//         Latitude: 51.49312,
//         Longitude: -0.22361,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646976060
//     },
//     {
//         Latitude: 51.49312,
//         Longitude: -0.22357,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646977063
//     },
//     {
//         Latitude: 51.49312,
//         Longitude: -0.22354,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646978067
//     },
//     {
//         Latitude: 51.49311,
//         Longitude: -0.22335,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646979067
//     },
//     {
//         Latitude: 51.4931,
//         Longitude: -0.2232,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646980071
//     },
//     {
//         Latitude: 51.49309,
//         Longitude: -0.22301,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646981074
//     },
//     {
//         Latitude: 51.4930868,
//         Longitude: -0.223012,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646982078
//     },
//     {
//         Latitude: 51.49306,
//         Longitude: -0.22298,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646983083
//     },
//     {
//         Latitude: 51.49306,
//         Longitude: -0.22297,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646984084
//     },
//     {
//         Latitude: 51.49305,
//         Longitude: -0.22295,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646985088
//     },
//     {
//         Latitude: 51.49304,
//         Longitude: -0.22294,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646986090
//     },
//     {
//         Latitude: 51.49304,
//         Longitude: -0.22292,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646987093
//     },
//     {
//         Latitude: 51.49304,
//         Longitude: -0.22291,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646988095
//     },
//     {
//         Latitude: 51.49303,
//         Longitude: -0.22289,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646989099
//     },
//     {
//         Latitude: 51.49303,
//         Longitude: -0.22287,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646990101
//     },
//     {
//         Latitude: 51.49303,
//         Longitude: -0.22285,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646991104
//     },
//     {
//         Latitude: 51.49303,
//         Longitude: -0.22283,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646992109
//     },
//     {
//         Latitude: 51.49302,
//         Longitude: -0.2228,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646993113
//     },
//     {
//         Latitude: 51.49302,
//         Longitude: -0.22277,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646994118
//     },
//     {
//         Latitude: 51.49301,
//         Longitude: -0.22275,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646995118
//     },
//     {
//         Latitude: 51.493,
//         Longitude: -0.22272,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646996121
//     },
//     {
//         Latitude: 51.493,
//         Longitude: -0.2227,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646997124
//     },
//     {
//         Latitude: 51.49299,
//         Longitude: -0.22266,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646998128
//     },
//     {
//         Latitude: 51.49297,
//         Longitude: -0.22263,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533646999134
//     },
//     {
//         Latitude: 51.49294,
//         Longitude: -0.2226,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647000138
//     },
//     {
//         Latitude: 51.49291,
//         Longitude: -0.22256,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647001141
//     },
//     {
//         Latitude: 51.49289,
//         Longitude: -0.22255,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647002146
//     },
//     {
//         Latitude: 51.49288,
//         Longitude: -0.22253,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647003149
//     },
//     {
//         Latitude: 51.49287,
//         Longitude: -0.22252,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647004154
//     },
//     {
//         Latitude: 51.49286,
//         Longitude: -0.22248,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647005158
//     },
//     {
//         Latitude: 51.49244,
//         Longitude: -0.22237,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647006163
//     },
//     {
//         Latitude: 51.49216,
//         Longitude: -0.22229,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647007164
//     },
//     {
//         Latitude: 51.49177,
//         Longitude: -0.22217,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647008168
//     },
//     {
//         Latitude: 51.4917,
//         Longitude: -0.22215,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647009171
//     },
//     {
//         Latitude: 51.49167,
//         Longitude: -0.22214,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647010174
//     },
//     {
//         Latitude: 51.49163,
//         Longitude: -0.22213,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647011177
//     },
//     {
//         Latitude: 51.4916,
//         Longitude: -0.22213,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647012178
//     },
//     {
//         Latitude: 51.49155,
//         Longitude: -0.22213,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647013179
//     },
//     {
//         Latitude: 51.49149,
//         Longitude: -0.22218,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647014179
//     },
//     {
//         Latitude: 51.49143,
//         Longitude: -0.22223,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647015180
//     },
//     {
//         Latitude: 51.49142,
//         Longitude: -0.22225,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647016182
//     },
//     {
//         Latitude: 51.49141,
//         Longitude: -0.22227,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647017186
//     },
//     {
//         Latitude: 51.4914,
//         Longitude: -0.22229,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647018189
//     },
//     {
//         Latitude: 51.49139,
//         Longitude: -0.22232,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647019190
//     },
//     {
//         Latitude: 51.49139,
//         Longitude: -0.22236,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647020193
//     },
//     {
//         Latitude: 51.49138,
//         Longitude: -0.22247,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647021200
//     },
//     {
//         Latitude: 51.49138,
//         Longitude: -0.2227,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647022205
//     },
//     {
//         Latitude: 51.49136,
//         Longitude: -0.22314,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647023210
//     },
//     {
//         Latitude: 51.4913637,
//         Longitude: -0.2231358,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647024214
//     },
//     {
//         Latitude: 51.49132,
//         Longitude: -0.22322,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647025219
//     },
//     {
//         Latitude: 51.49131,
//         Longitude: -0.22327,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647026223
//     },
//     {
//         Latitude: 51.49129,
//         Longitude: -0.2233,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647027226
//     },
//     {
//         Latitude: 51.49125,
//         Longitude: -0.22338,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647028229
//     },
//     {
//         Latitude: 51.49122,
//         Longitude: -0.22343,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647029232
//     },
//     {
//         Latitude: 51.4912,
//         Longitude: -0.22346,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647030235
//     },
//     {
//         Latitude: 51.49117,
//         Longitude: -0.22349,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647031240
//     },
//     {
//         Latitude: 51.49115,
//         Longitude: -0.2235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647032245
//     },
//     {
//         Latitude: 51.49114,
//         Longitude: -0.2235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647033249
//     },
//     {
//         Latitude: 51.49111,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647034252
//     },
//     {
//         Latitude: 51.4911,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647035256
//     },
//     {
//         Latitude: 51.49107,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647036258
//     },
//     {
//         Latitude: 51.49103,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647037262
//     },
//     {
//         Latitude: 51.49101,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647038263
//     },
//     {
//         Latitude: 51.49094,
//         Longitude: -0.2235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647039267
//     },
//     {
//         Latitude: 51.49091,
//         Longitude: -0.2235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647040268
//     },
//     {
//         Latitude: 51.49089,
//         Longitude: -0.2235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647041269
//     },
//     {
//         Latitude: 51.49087,
//         Longitude: -0.2235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647042271
//     },
//     {
//         Latitude: 51.49085,
//         Longitude: -0.2235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647043276
//     },
//     {
//         Latitude: 51.49083,
//         Longitude: -0.2235,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647044278
//     },
//     {
//         Latitude: 51.4908,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647045281
//     },
//     {
//         Latitude: 51.49078,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647046285
//     },
//     {
//         Latitude: 51.49077,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647047289
//     },
//     {
//         Latitude: 51.49076,
//         Longitude: -0.22352,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647048292
//     },
//     {
//         Latitude: 51.49074,
//         Longitude: -0.22352,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647049298
//     },
//     {
//         Latitude: 51.49073,
//         Longitude: -0.22353,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647050302
//     },
//     {
//         Latitude: 51.49072,
//         Longitude: -0.22354,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647051304
//     },
//     {
//         Latitude: 51.4907,
//         Longitude: -0.22355,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647052308
//     },
//     {
//         Latitude: 51.49064,
//         Longitude: -0.22353,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647053312
//     },
//     {
//         Latitude: 51.49053,
//         Longitude: -0.22351,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647054313
//     },
//     {
//         Latitude: 51.49047,
//         Longitude: -0.22349,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647055317
//     },
//     {
//         Latitude: 51.49039,
//         Longitude: -0.22347,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647056320
//     },
//     {
//         Latitude: 51.49032,
//         Longitude: -0.22345,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647057323
//     },
//     {
//         Latitude: 51.49023,
//         Longitude: -0.22341,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647058327
//     },
//     {
//         Latitude: 51.49011,
//         Longitude: -0.22337,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647059329
//     },
//     {
//         Latitude: 51.49,
//         Longitude: -0.22329,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647060329
//     },
//     {
//         Latitude: 51.48987,
//         Longitude: -0.2232,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647061330
//     },
//     {
//         Latitude: 51.48971,
//         Longitude: -0.22311,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647062331
//     },
//     {
//         Latitude: 51.48968,
//         Longitude: -0.22308,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647063332
//     },
//     {
//         Latitude: 51.48965,
//         Longitude: -0.22307,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647064337
//     },
//     {
//         Latitude: 51.48963,
//         Longitude: -0.22306,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647065342
//     },
//     {
//         Latitude: 51.4896,
//         Longitude: -0.22305,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647066346
//     },
//     {
//         Latitude: 51.48956,
//         Longitude: -0.22303,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647067351
//     },
//     {
//         Latitude: 51.48948,
//         Longitude: -0.22302,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647068355
//     },
//     {
//         Latitude: 51.48931,
//         Longitude: -0.22299,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647069360
//     },
//     {
//         Latitude: 51.4892,
//         Longitude: -0.22298,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647070366
//     },
//     {
//         Latitude: 51.48906,
//         Longitude: -0.22294,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647071371
//     },
//     {
//         Latitude: 51.48898,
//         Longitude: -0.22291,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647072371
//     },
//     {
//         Latitude: 51.48881,
//         Longitude: -0.22285,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647073376
//     },
//     {
//         Latitude: 51.48867,
//         Longitude: -0.22281,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647074379
//     },
//     {
//         Latitude: 51.48862,
//         Longitude: -0.22279,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647075383
//     },
//     {
//         Latitude: 51.48851,
//         Longitude: -0.22275,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647076386
//     },
//     {
//         Latitude: 51.48842,
//         Longitude: -0.22272,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647077390
//     },
//     {
//         Latitude: 51.48837,
//         Longitude: -0.22271,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647078393
//     },
//     {
//         Latitude: 51.48831,
//         Longitude: -0.22268,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647079396
//     },
//     {
//         Latitude: 51.48824,
//         Longitude: -0.22265,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647080398
//     },
//     {
//         Latitude: 51.48814,
//         Longitude: -0.2226,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647081403
//     },
//     {
//         Latitude: 51.48808,
//         Longitude: -0.22255,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647082406
//     },
//     {
//         Latitude: 51.488,
//         Longitude: -0.22247,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647083407
//     },
//     {
//         Latitude: 51.48798,
//         Longitude: -0.22245,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647084408
//     },
//     {
//         Latitude: 51.48788,
//         Longitude: -0.22233,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647085413
//     },
//     {
//         Latitude: 51.48776,
//         Longitude: -0.22219,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647086417
//     },
//     {
//         Latitude: 51.48774,
//         Longitude: -0.22216,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647087419
//     },
//     {
//         Latitude: 51.4876,
//         Longitude: -0.22202,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647088423
//     },
//     {
//         Latitude: 51.4875,
//         Longitude: -0.22192,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647089427
//     },
//     {
//         Latitude: 51.48744,
//         Longitude: -0.22184,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647090431
//     },
//     {
//         Latitude: 51.48736,
//         Longitude: -0.22174,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647091437
//     },
//     {
//         Latitude: 51.48718,
//         Longitude: -0.2215,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647092440
//     },
//     {
//         Latitude: 51.48717,
//         Longitude: -0.2215,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647093444
//     },
//     {
//         Latitude: 51.48707,
//         Longitude: -0.22137,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647094449
//     },
//     {
//         Latitude: 51.48699,
//         Longitude: -0.22128,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647095453
//     },
//     {
//         Latitude: 51.48693,
//         Longitude: -0.22122,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647096456
//     },
//     {
//         Latitude: 51.48686,
//         Longitude: -0.22114,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647097460
//     },
//     {
//         Latitude: 51.4867,
//         Longitude: -0.221,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647098463
//     },
//     {
//         Latitude: 51.48655,
//         Longitude: -0.22088,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647099465
//     },
//     {
//         Latitude: 51.48634,
//         Longitude: -0.22071,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647100466
//     },
//     {
//         Latitude: 51.48618,
//         Longitude: -0.22059,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647101467
//     },
//     {
//         Latitude: 51.48608,
//         Longitude: -0.22052,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647102472
//     },
//     {
//         Latitude: 51.48604,
//         Longitude: -0.22048,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647103474
//     },
//     {
//         Latitude: 51.48599,
//         Longitude: -0.22046,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647104478
//     },
//     {
//         Latitude: 51.48594,
//         Longitude: -0.22043,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647105479
//     },
//     {
//         Latitude: 51.48593,
//         Longitude: -0.22042,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647106483
//     },
//     {
//         Latitude: 51.48585,
//         Longitude: -0.22037,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647107487
//     },
//     {
//         Latitude: 51.48558,
//         Longitude: -0.22026,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647108493
//     },
//     {
//         Latitude: 51.48542,
//         Longitude: -0.2202,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647109495
//     },
//     {
//         Latitude: 51.48532,
//         Longitude: -0.22017,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647110500
//     },
//     {
//         Latitude: 51.48521,
//         Longitude: -0.22013,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647111505
//     },
//     {
//         Latitude: 51.48507,
//         Longitude: -0.22008,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647112510
//     },
//     {
//         Latitude: 51.48499,
//         Longitude: -0.22006,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647113512
//     },
//     {
//         Latitude: 51.48479,
//         Longitude: -0.22,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647114516
//     },
//     {
//         Latitude: 51.48463,
//         Longitude: -0.21995,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647115517
//     },
//     {
//         Latitude: 51.48445,
//         Longitude: -0.21988,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647116522
//     },
//     {
//         Latitude: 51.48432,
//         Longitude: -0.21982,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647117526
//     },
//     {
//         Latitude: 51.48414,
//         Longitude: -0.21972,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647118529
//     },
//     {
//         Latitude: 51.48407,
//         Longitude: -0.21965,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647119534
//     },
//     {
//         Latitude: 51.48401,
//         Longitude: -0.2196,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647120538
//     },
//     {
//         Latitude: 51.48386,
//         Longitude: -0.21951,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647121543
//     },
//     {
//         Latitude: 51.48373,
//         Longitude: -0.21941,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647122544
//     },
//     {
//         Latitude: 51.48367,
//         Longitude: -0.21937,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647123549
//     },
//     {
//         Latitude: 51.48363,
//         Longitude: -0.21933,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647124550
//     },
//     {
//         Latitude: 51.48354,
//         Longitude: -0.21925,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647125553
//     },
//     {
//         Latitude: 51.48349,
//         Longitude: -0.21921,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647126558
//     },
//     {
//         Latitude: 51.48346,
//         Longitude: -0.2192,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647127562
//     },
//     {
//         Latitude: 51.48344,
//         Longitude: -0.21919,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647128566
//     },
//     {
//         Latitude: 51.48342,
//         Longitude: -0.21919,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647129570
//     },
//     {
//         Latitude: 51.48339,
//         Longitude: -0.21918,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647130575
//     },
//     {
//         Latitude: 51.48337,
//         Longitude: -0.21918,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647131580
//     },
//     {
//         Latitude: 51.48336,
//         Longitude: -0.21918,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647132584
//     },
//     {
//         Latitude: 51.48334,
//         Longitude: -0.21919,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647133586
//     },
//     {
//         Latitude: 51.48325,
//         Longitude: -0.21912,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647134590
//     },
//     {
//         Latitude: 51.48314,
//         Longitude: -0.21904,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647135593
//     },
//     {
//         Latitude: 51.48308,
//         Longitude: -0.21899,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647136598
//     },
//     {
//         Latitude: 51.4829,
//         Longitude: -0.21886,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647137602
//     },
//     {
//         Latitude: 51.48289,
//         Longitude: -0.21885,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647138605
//     },
//     {
//         Latitude: 51.48261,
//         Longitude: -0.21869,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647139607
//     },
//     {
//         Latitude: 51.48236,
//         Longitude: -0.21855,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647140611
//     },
//     {
//         Latitude: 51.48214,
//         Longitude: -0.21843,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647141617
//     },
//     {
//         Latitude: 51.48183,
//         Longitude: -0.21829,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647142618
//     },
//     {
//         Latitude: 51.48152,
//         Longitude: -0.21814,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647143622
//     },
//     {
//         Latitude: 51.4814,
//         Longitude: -0.21809,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647144628
//     },
//     {
//         Latitude: 51.48125,
//         Longitude: -0.21801,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647145631
//     },
//     {
//         Latitude: 51.48121,
//         Longitude: -0.218,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647146637
//     },
//     {
//         Latitude: 51.48111,
//         Longitude: -0.21795,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647147641
//     },
//     {
//         Latitude: 51.48105,
//         Longitude: -0.21793,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647148644
//     },
//     {
//         Latitude: 51.481,
//         Longitude: -0.21791,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647149647
//     },
//     {
//         Latitude: 51.48094,
//         Longitude: -0.21789,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647150647
//     },
//     {
//         Latitude: 51.48089,
//         Longitude: -0.21787,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647151650
//     },
//     {
//         Latitude: 51.48079,
//         Longitude: -0.21784,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647152656
//     },
//     {
//         Latitude: 51.48075,
//         Longitude: -0.21784,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647153656
//     },
//     {
//         Latitude: 51.48072,
//         Longitude: -0.21783,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647154657
//     },
//     {
//         Latitude: 51.48069,
//         Longitude: -0.21783,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647155663
//     },
//     {
//         Latitude: 51.48067,
//         Longitude: -0.21782,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647156664
//     },
//     {
//         Latitude: 51.48066,
//         Longitude: -0.21782,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647157665
//     },
//     {
//         Latitude: 51.48061,
//         Longitude: -0.2178,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647158668
//     },
//     {
//         Latitude: 51.48056,
//         Longitude: -0.2178,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647159670
//     },
//     {
//         Latitude: 51.48044,
//         Longitude: -0.21778,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647160671
//     },
//     {
//         Latitude: 51.48037,
//         Longitude: -0.21776,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647161673
//     },
//     {
//         Latitude: 51.48027,
//         Longitude: -0.21774,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647162678
//     },
//     {
//         Latitude: 51.48018,
//         Longitude: -0.21773,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647163680
//     },
//     {
//         Latitude: 51.48011,
//         Longitude: -0.21771,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647164684
//     },
//     {
//         Latitude: 51.48001,
//         Longitude: -0.21769,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647165686
//     },
//     {
//         Latitude: 51.47986,
//         Longitude: -0.21766,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647166687
//     },
//     {
//         Latitude: 51.47967,
//         Longitude: -0.21761,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647167692
//     },
//     {
//         Latitude: 51.47955,
//         Longitude: -0.21758,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647168695
//     },
//     {
//         Latitude: 51.47941,
//         Longitude: -0.21755,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647169700
//     },
//     {
//         Latitude: 51.47936,
//         Longitude: -0.21753,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647170704
//     },
//     {
//         Latitude: 51.47932,
//         Longitude: -0.21752,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647171709
//     },
//     {
//         Latitude: 51.4793,
//         Longitude: -0.21752,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647172712
//     },
//     {
//         Latitude: 51.47928,
//         Longitude: -0.21751,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647173716
//     },
//     {
//         Latitude: 51.47918,
//         Longitude: -0.21748,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647174721
//     },
//     {
//         Latitude: 51.47913,
//         Longitude: -0.21747,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647175726
//     },
//     {
//         Latitude: 51.47903,
//         Longitude: -0.21744,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647176728
//     },
//     {
//         Latitude: 51.47892,
//         Longitude: -0.21741,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647177732
//     },
//     {
//         Latitude: 51.47884,
//         Longitude: -0.21738,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647178734
//     },
//     {
//         Latitude: 51.4788,
//         Longitude: -0.21737,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647179738
//     },
//     {
//         Latitude: 51.47874,
//         Longitude: -0.21735,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647180741
//     },
//     {
//         Latitude: 51.47869,
//         Longitude: -0.21732,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647181744
//     },
//     {
//         Latitude: 51.47854,
//         Longitude: -0.21726,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647182749
//     },
//     {
//         Latitude: 51.47848,
//         Longitude: -0.21723,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647183752
//     },
//     {
//         Latitude: 51.47842,
//         Longitude: -0.2172,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647184757
//     },
//     {
//         Latitude: 51.47837,
//         Longitude: -0.21716,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647185761
//     },
//     {
//         Latitude: 51.4783,
//         Longitude: -0.21711,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647186766
//     },
//     {
//         Latitude: 51.4782,
//         Longitude: -0.21704,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647187771
//     },
//     {
//         Latitude: 51.478,
//         Longitude: -0.21687,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647188776
//     },
//     {
//         Latitude: 51.4780035,
//         Longitude: -0.21687,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647189780
//     },
//     {
//         Latitude: 51.47699,
//         Longitude: -0.21934,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647190783
//     },
//     {
//         Latitude: 51.4769862,
//         Longitude: -0.2193383,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647191788
//     },
//     {
//         Latitude: 51.47698,
//         Longitude: -0.21934,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647192791
//     },
//     {
//         Latitude: 51.47698,
//         Longitude: -0.21933,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647193795
//     },
//     {
//         Latitude: 51.47697,
//         Longitude: -0.21933,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647194800
//     },
//     {
//         Latitude: 51.47696,
//         Longitude: -0.21933,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647195800
//     },
//     {
//         Latitude: 51.47696,
//         Longitude: -0.21934,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647196804
//     },
//     {
//         Latitude: 51.47695,
//         Longitude: -0.21934,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647197807
//     },
//     {
//         Latitude: 51.47695,
//         Longitude: -0.21935,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647198813
//     },
//     {
//         Latitude: 51.47694,
//         Longitude: -0.21935,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647199815
//     },
//     {
//         Latitude: 51.47694,
//         Longitude: -0.21936,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647200820
//     },
//     {
//         Latitude: 51.47676,
//         Longitude: -0.21922,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647201824
//     },
//     {
//         Latitude: 51.47673,
//         Longitude: -0.21919,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647202829
//     },
//     {
//         Latitude: 51.47663,
//         Longitude: -0.21911,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647203834
//     },
//     {
//         Latitude: 51.47658,
//         Longitude: -0.21907,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647204837
//     },
//     {
//         Latitude: 51.47627,
//         Longitude: -0.21882,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647205841
//     },
//     {
//         Latitude: 51.4762732,
//         Longitude: -0.2188177,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647206846
//     },
//     {
//         Latitude: 51.47536,
//         Longitude: -0.22089,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647207849
//     },
//     {
//         Latitude: 51.4753556,
//         Longitude: -0.2208904,
//         DriverId: 'driver2',
//         Speed: 0,
//         Bearing: 15,
//         TimeStamp: 1533647208852
//     },
// ];

function refineLocations(rawData) {
    return new Promise(function (resolve, reject) {
        var variance;
        var lastLocation;
        var lastBearing;
        var filteredLocations = [];

        console.log("Total locations sent " + rawData.length);

        rawData.map(function (rawData) {
            var rawLocation = JSON.parse(rawData);
            // rawLocation = rawData;
            if (!discardFilter(rawLocation, lastLocation, lastBearing)) {
                var result = kalmanFilter(rawLocation, lastLocation, config.filters.kalman.constant, variance);
                variance = result.variance;
                lastLocation = result.location;
                lastBearing = result.bearing;
                filteredLocations.push(result.location);
            }
            else {
                lastLocation = rawLocation;
                lastBearing = rawLocation.Bearing;
            }
        });

        console.log("After Kalman and Discard "+ filteredLocations.length);

        var points = simplify(filteredLocations, config.filters.simplify.tolerance);

        console.log("After Simplify JS "+ points.length);

        _saveLocationsToDB(points).then(function () {
            resolve(points);
        });
    })
}

function _saveLocationsToDB(locations) {
    return new Promise(function (resolve, reject) {
        var queue = [];

        for (var i = 0; i < locations.length; i++) {
            var loc = new Location(locations[i]);
            queue.push(loc.save());
        }
        Promise.all(queue).then(function () {
            resolve();
        })
    });
}

module.exports = {
    refineLocations: refineLocations
};