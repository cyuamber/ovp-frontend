// mock data
module.exports = function () {
    var faker = require("faker");
    var _ = require("lodash");
    faker.locale = "en";
    var Address = require("./json/address.json");  // import local mock data
    return {
        //this is remote mock data created by faker.js
        home: _.times(20, function (n) {
            return {
                id: n,
                name: faker.name.findName(),
                phone: faker.phone.phoneNumber(),
                address: faker.address.streetAddress(),
                avatar: faker.internet.avatar()
            }
        }),
        //this is local mock data
        address: Address,
    }
}