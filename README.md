# sync-patch-cli

<font size=4>paste infomation about patch in mailman in bugzilla</font>

----------

How it work?

1. monite new sending patch of the project you set.
2. parse patch content, find bug id in bugzilla、 patch sender、 time、 subject and so on
3. find address with bug id in bugzilla
4. paste the information as comment
5. close bug in bugzilla if you want

----------

####Configuration Example:####

    {
        "bugzillaUrl": "http://domain_name/bugzilla3/index.cgi",
        "maillistUrl": "http://domain_name/cgi-bin/mailman/listinfo",
        "mode": "scheduled",
        "username": "",
        "password": "",
        "scheduled": [{
                "project": "example",
                "engineers": [
                    "liqingjht"
                ],
                "close": true,
                "active": false
            }
        ],
        "fast": [{
                "project": "example",
                "beforeDays": "7",
                "engineers": [
                    "liqingjht"
                ],
                "close": false,
                "active": false
            }
        ]
    }