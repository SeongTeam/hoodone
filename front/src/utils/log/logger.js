import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import process from "process";
import { dir } from "console";
import { dirname } from "path";

/*
ref : https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-Winston-%EB%AA%A8%EB%93%88-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%84%9C%EB%B2%84-%EB%A1%9C%EA%B7%B8-%EA%B4%80%EB%A6%AC

#주의사항
- Logger 객체는 client side에서 사용 불가. 
 https://github.com/winstonjs/winston/issues/1631#:~:text=If%20you%27re%20trying,the%20File%20transport.
*/

/* TODO
- server side logger middle ware 구현하기
    ref : https://velog.io/@byron1st/Next.js-API-Routes%EC%97%90-API-Logger-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0
*/

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: combine(
        timestamp({ format: `YYYY-MM-DD HH:mm:ss` }),
        label({ label: "hoodone-front"}),
        logFormat,
    ),

    transports: [
        new winstonDaily({
            level: "info",
            datePattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),

        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: logDir + "/error",
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],

    exceptionHandlers: [
        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});


if(process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(
                winston.format.colorize(),
                winston.format.simple(),
            ),
    }));
}

export default logger;