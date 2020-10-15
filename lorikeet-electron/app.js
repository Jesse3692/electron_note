'use strict';

const osenv = require('osenv');

function getUserHomeFolder() {
    return osenv.home();
}
