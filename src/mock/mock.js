// mock data
module.exports = function () {
    var faker = require("faker");
    var _ = require("lodash");
    faker.locale = "en";
    var Address = require("./json/address.json");
    return {
        //this is mock data
        home: _.times(20, function (n) {
            return {
                id: n,
                name: faker.name.findName(),
                phone: faker.phone.phoneNumber(),
                address: faker.address.streetAddress(),
                avatar: faker.internet.avatar()
            }
        }),
        //this is import data
        address: Address
    }
}