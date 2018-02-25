var fs = require("fs");
var program = require("commander");
var readlineSync = require('readline-sync');
//var crypto = require("crypto");

function getConfig() {
    try {
        var confStr = fs.readFileSync('./config.json', 'utf-8');
        var conf = JSON.parse(confStr);
        var confBak = JSON.parse(confStr);
        if (conf.username == "" || conf.password == "") {
            console.warn("Welcome! Please setup your account of Bugzilla.\n" +
                "You can also run 'node app.js -u <username> -p <password>' to change default account.");
            conf.username = readlineSync.question('username: '); // " cause bug
            conf.password = readlineSync.question("password: ", { hideEchoBack: true });
            saveConfig(conf);
        }
    } catch (err) {
        if (!conf)
            console.error("Can't read data from config file.");
        else
            console.error("Bad format of config file.");
        process.exit(1);
    }

    program.option('-s, --scheduled [projects]', 'post patch from now on by scheduled. eg:R7600,R9000')
        .option('-f, --fast [projects]', 'post last few days patch. eg:R7600,R9000')
        .option('-u, --username <value>', 'set username of bugzilla')
        .option('-p, --password <value>', 'set password of bugzilla')
        .parse(process.argv);
    if (program.username && program.password) {
        conf.username = program.username;
        conf.password = program.password;
        saveConfig(conf);
    }

    var runProject = "";
    if ((program.fast && program.fast != true) || (program.fast && hasActiveItem("fast"))) {
        conf.mode = "fast";
    } else if ((program.scheduled && program.scheduled != true) || (program.scheduled && hasActiveItem("scheduled"))) {
        conf.mode = "scheduled";
    } else {
        var modes = ['Post patch URL from now on', 'Post patch URL before ? days'];
        var modeConf = ["", "scheduled", "fast"];
        var mode = parseInt(readlineSync.keyInSelect(modes, 'Which mode you want to run this tool? ')) + 1;
        if (mode == 0) {
            console.log("Bye bye ...");
            process.exit(0);
        } else {
            conf.mode = modeConf[mode];
            while (runProject == "") {
                runProject = readlineSync.question('Please input projects on maillist (eg: R7600,R9000): ');
            }
        }
    }
    var currentSetting = new Array();
    if (runProject == "") {
        for (let i in conf[conf.mode]) {
            if (conf[conf.mode][i].active)
                runProject += conf[conf.mode][i].project + ","
        }
        runProject.split("").slice(0, runProject.length - 1).join("");
    }
    runProject = (runProject == "" ? program[conf.mode] : runProject);
    var each = runProject.split(",");
    for (var i in conf[conf.mode]) {
        if (each.indexOf(conf[conf.mode][i].project) != -1) {
            conf[conf.mode][i].active = true;
            currentSetting.push(conf[conf.mode][i]);
        } else
            conf[conf.mode][i].active = false;
    }
    if (currentSetting.length == 0) {
        console.error("Can't find the project you input. Please check the config file.");
        process.exit(1);
    }
    console.log("----------------------\nUse following settings to run " + conf.mode + " Sync:")
    console.log(JSON.stringify(currentSetting, null, '\t'))
    console.log("----------------------\n");
    if (!readlineSync.keyInYN('Do you want to continue?')) {
        console.log("Bye bye ...");
        process.exit(1);
    }

    return conf;

    function hasActiveItem(mode) {
        for (let i in conf[mode]) {
            if (conf[mode][i].active)
                return true;
        }
        return false;
    }
}

function saveConfig(obj) {
    try {
        fs.writeFileSync('./config.json', JSON.stringify(obj, null, '\t'))
    } catch (err) {
        console.error("Can't save settings to config file.");
    }
}

module.exports = getConfig();