#!/bin/bash

# get current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ "$1" == "on" ]; then
    # If not running, start MongoDB
    if [ -z "$(sudo systemctl status mongod | grep Active | grep running)" ]; then
        sudo systemctl start mongod
        if [ -z "$(sudo systemctl status mongod | grep Active | grep running)" ]; then
            echo -e "\e[31mError:\e[0m MongoDB failed to start"
            exit 1
        else
            echo -e "\e[32mStarting\e[0m\e[90m -> \e[0m\e[32mMongoDB\e[0m"
        fi
    else
        echo -e "\e[32mMongoDB\e[0m\e[90m -> \e[0m\e[32mAlready running\e[0m"
    fi

    # Start Express server
    if [ -z "$(netstat -an|grep 4001|grep tcp)" ]; then
        cd $DIR/ExpressServer/
        nohup npm start & > /dev/null
        if [ -z "$(netstat -an|grep 4001|grep tcp)" ]; then
            echo -e "\e[31mError:\e[0m Express server failed to start"
            exit 1
        else
            echo -e "\e[32mStarting\e[0m\e[90m -> \e[0m\e[32mExpress server\e[0m"
        fi
    else
        echo -e "\e[32mExpress server\e[0m\e[90m -> \e[0m\e[32mAlready running\e[0m"
    fi

    # Start Sample Issuer server
    if [ -z "$(netstat -an|grep 4000|grep tcp)" ]; then
        cd $DIR/SampleIssuerService/
        nohup npm start & > /dev/null
        if [ -z "$(netstat -an|grep 4000|grep tcp)" ]; then
            echo -e "\e[31mError:\e[0m Sample Issuer server failed to start"
            exit 1
        else
            echo -e "\e[32mStarting\e[0m\e[90m -> \e[0m\e[32mSample Issuer server\e[0m"
        fi
    else
        echo -e "\e[32mSample Issuer server\e[0m\e[90m -> \e[0m\e[32mAlready running\e[0m"
    fi

    # Start React server
    if [ -z "$(netstat -an|grep 3000|grep tcp)" ]; then
        cd $DIR/issuer-frontend/
        nohup npm start & > /dev/null
        if [ -z "$(netstat -an|grep 3000|grep tcp)" ]; then
            echo -e "\e[31mError:\e[0m React failed to start"
            exit 1
        else
            echo -e "\e[32mStarting\e[0m\e[90m -> \e[0m\e[32mReact\e[0m"
        fi
    else
        echo -e "\e[32mReact\e[0m\e[90m -> \e[0m\e[32mAlready running\e[0m"
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
elif [ "$1" == "status" ]; then
    # MongoDB
    if [ -n "$(sudo systemctl status mongod | grep Active | grep running)" ]; then
        echo -e "\e[32mMongoDB\e[0m\e[90m -> \e[0m\e[32mRunning\e[0m"
    else
        echo -e "\e[31mMongoDB\e[0m\e[90m -> \e[0m\e[31mNot running\e[0m"
    fi

    # Express server
    if [ -n "$(netstat -an|grep 4001)" ]; then
        echo -e "\e[32mExpress server\e[0m\e[90m -> \e[0m\e[32mRunning\e[0m"
    else
        echo -e "\e[31mExpress server\e[0m\e[90m -> \e[0m\e[31mNot running\e[0m"
    fi

    # Sample Issuer server
    if [ -n "$(netstat -an|grep 4000)" ]; then
        echo -e "\e[32mSample Issuer server\e[0m\e[90m -> \e[0m\e[32mRunning\e[0m"
    else
        echo -e "\e[31mSample Issuer server\e[0m\e[90m -> \e[0m\e[31mNot running\e[0m"
    fi

    # React server
    if [ -n "$(netstat -an|grep 3000)" ]; then
        echo -e "\e[32mReact\e[0m\e[90m -> \e[0m\e[32mRunning\e[0m"
    else
        echo -e "\e[31mReact\e[0m\e[90m -> \e[0m\e[31mNot running\e[0m"
    fi
else
    echo -e "\e[33mUsage:\e[0m devEnv.sh [\e[32mon\e[0m|\e[31moff\e[0m]\e[0m|\e[33mstatus\e[0m]"
fi
