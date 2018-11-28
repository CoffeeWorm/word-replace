const fs = require('fs');


let method2Promise = (name, container) => {
    if (!fs[name]) {
        throw (new ReferenceError(`There is no ${name} method!`));
    }
    container[name] = (...args) => {
        return new Promise((rel, rej) => {
            let callback = (err, data) => {
                if (err) {
                    return rej(err);
                }
                return rel(data);
            };

            args = args.concat(callback);
            fs[name](...args);
        });
    }
}

let which2trans = (container, conf) => {
    let flag;
    if (!conf) {
        conf = Object.keys(fs);
        flag = false;
    }

    conf.forEach(property => {
        if (flag) {
            method2Promise(property, container);
            return;
        }
        if (!flag && !/sync/i.test(property)) {
            method2Promise(property, container);
            return;
        }
    });
}

module.exports = which2trans;
