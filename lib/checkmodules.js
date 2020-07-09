module.exports = (modules) => {
    let failedmods = [];
    modules.forEach(a => {
        try {
            require(a)
            // console.log("what")
        } catch { failedmods.push(a); }
        // require(a)
    })

    if (failedmods.length != 0) {
        let exitedB4 = false;
        console.log(`[!] Dependencies are missing! Proceeding to install automatically.\nPlease allow up for a few ${failedmods.length < 3 ? "seconds" : "minutes"}.\n\nMissing dependencies:\n   ${failedmods.join("\n   ")}\n----`)
        let states = [
            "\\ Installing...",
            "| Installing...",
            "/ Installing...",
            "- Installing..."
        ]
        let state = 0;
        let i = setInterval(() => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0)
            state++;
            if (state >= states.length) state = 0;
            process.stdout.write(states[state]);
        }, 100)
        let a = require("child_process").exec(`cmd /c "npm i ${failedmods.join(" ")}"`, function (err, stdout, stderr) {
            if (err || stderr.toString.length > 1) {
                return console.log(`Failed to install. Please install missing dependencies manually by running "npm i ${failedmods.join(" ")}" in this folder.`)
            }

            console.log("Finished installing dependencies. Please restart the program.")
            process.exit(0);
        })
        a.stdout.once("data", () => {
            clearInterval(i)
            console.log("")
        })
        a.stdout.on("data", console.log);
        process.on("SIGINT",function(signal){console.log("Aborting installation...");require("fs").unlinkSync("./node_modules");process.exit(0)})

    } else { return true; }
}