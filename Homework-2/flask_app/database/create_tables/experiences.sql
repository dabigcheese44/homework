CREATE TABLE IF NOT EXISTS `experiences` (
    `experience_id` int(11)         NOT NULL AUTO_INCREMENT COMMENT 'The experience id',
    `position_id`   int(11)         NOT NULL                COMMENT 'FK: The position id',
    `name`          varchar(150)    NOT NULL                COMMENT 'Name of the experience',
    `description`   text            NOT NULL                COMMENT 'Description of the experience',
    `hyperlink`     varchar(300)    DEFAULT NULL            COMMENT 'Link where people can learn more about the experience',
    `start_date`    date            NOT NULL                COMMENT 'Start date of experience',
    `end_date`      date            DEFAULT NULL            COMMENT 'End date of experience',
    PRIMARY KEY (`experience_id`),
    FOREIGN KEY (`position_id`) REFERENCES positions(`position_id`)
)   ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='Experiences associated with each position';
