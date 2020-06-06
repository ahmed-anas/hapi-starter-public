const expect = require('chai').expect;
const UserHelper = require('./user-helper');

describe('calculateUserAge => function', () => {
    it('Should compute age of 0', () => {
        let age = UserHelper.calculateUserAge(new Date().getTime());
        expect(age).to.eq('0');
    });

    it('should compute age of 5 years', () => {

        let fiveYearAgo = new Date();
        fiveYearAgo.setFullYear(new Date().getFullYear() - 5);
        let age = UserHelper.calculateUserAge(fiveYearAgo.getTime());
        expect(age).to.eq('5');
    })

    it('should give error on negative age', () => {
        expect(
            () => UserHelper.calculateUserAge(new Date().getTime() + 10000000)
        ).to.throw();
    })



});
