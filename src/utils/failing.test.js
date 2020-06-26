const expect = require('chai').expect;
const UserHelper = require('./user-helper');

describe('Failing test', () => {
    it('Will Fail', () => {
        let age = UserHelper.calculateUserAge(new Date().getTime());
        expect('1').to.eq('0');
    });

});
