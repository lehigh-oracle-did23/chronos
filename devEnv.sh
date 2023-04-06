#!/bin/bash

if [ "$1" == "on" ]; then
    # If not running, start MongoDB
    if [ -z "$(sudo systemctl status mongod | grep Active | grep running)" ]; then
        echo -e "\e[32mStarting\e[0m\e[90m -> \e[0m\e[32mMongoDB\e[0m"
        sudo systemctl start mongod
    fi

    # Start Express server
    if [ -z "$(netstat -an|grep 4001)" ]; then
        echo -e "\e[32mStarting\e[0m\e[90m -> \e[0m\e[32mExpress server\e[0m"
        cd ~/DID22/ExpressServer
        nohup npm start & > /dev/null
    fi

    # Start Sample Issuer server
    if [ -z "$(netstat -an|grep 4000)" ]; then
        echo -e "\e[32mStarting\e[0m\e[90m -> \e[0m\e[32mSample Issuer server\e[0m"
        cd ~/DID22/SampleIssuerService
        nohup npm start & > /dev/null
    fi

    # Start React server
    if [ -z "$(netstat -an|grep 3000)" ]; then
        # echo in green
        echo -e "\e[32mStarting\e[0m\e[90m -> \e[0m\e[32mReact\e[0m"
        cd ~/DID22/issuer-frontend
        nohup npm start & > /dev/null
    fi
elif [ "$1" == "off" ]; then
    # Stop MongoDB
    if [ -n "$(sudo systemctl status mongod | grep Active | grep running)" ]; then
        echo -e "\e[31mStopping\e[0m\e[90m -> \e[0m\e[31mMongoDB\e[0m"
        sudo systemctl stop mongod
    fi

    # Stop Express server
    if [ -n "$(netstat -an|grep 4001)" ]; then
        echo -e "\e[31mStopping\e[0m\e[90m -> \e[0m\e[31mExpress server\e[0m"
        ps -ef | grep node | grep app.js | awk '{print $2}' | xargs kill -9
    fi

    # Stop Sample Issuer server
    if [ -n "$(netstat -an|grep 4000)" ]; then
        echo -e "\e[31mStopping\e[0m\e[90m -> \e[0m\e[31mSample Issuer server\e[0m"
        if [ -n "$(ps -ef | grep node | grep app.js | awk '{print $2}')" ]; then
            ps -ef | grep node | grep app.js | awk '{print $2}' | xargs kill -9
        fi
    fi

    # Stop React server
    if [ -n "$(netstat -an|grep 3000)" ]; then
        echo -e "\e[31mStopping\e[0m\e[90m -> \e[0m\e[31mReact\e[0m"
        ps -ef | grep node | grep issuer-frontend | awk '{print $2}' | xargs kill -9
    fi
else
    echo -e "\e[33mUsage:\e[0m devEnv.sh [\e[32mon\e[0m|\e[31moff\e[0m]"
fi
