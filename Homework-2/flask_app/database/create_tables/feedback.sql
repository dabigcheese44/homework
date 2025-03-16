CREATE TABLE IF NOT EXISTS `feedback` (
    `comment_id`    int(11)         NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each comment',
    `name`          varchar(150)    NOT NULL                COMMENT 'The commentators name',
    `email`         varchar(150)    NOT NULL                COMMENT 'The commentators email',
    `comment`       text            NOT NULL                COMMENT 'The text of the comment',
    PRIMARY KEY (`comment_id`)
)   ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='Feedback from visitors about the website';