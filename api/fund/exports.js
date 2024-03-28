module.exports = {
    // Utilizing hourly and daily for simple testing purposes
    fundPeriods: [ "quarterly", "monthly", "hourly", "daily" ],

    fundType: ["1/10", "2/20", "3/30"],

    getThreshold: function(type) {
        switch(type) {
            case "1/10":
                return 0.03;
            case "2/20":
                return 0.05;
            case "3/30":
                return 0.07;
            default:
                return null;
        }
    },

    getProfit: function(type) {
        switch(type) {
            case "1/10":
                return 0.10;
            case "2/20":
                return 0.20;
            case "3/30":
                return 0.30;
            default:
                return null;
        }
    },

    getFee: function(type) {
        switch(type) {
            case "1/10":
                return 0.01;
            case "2/20":
                return 0.02;
            case "3/30":
                return 0.03;
            default:
                return null;
        }
    },
}