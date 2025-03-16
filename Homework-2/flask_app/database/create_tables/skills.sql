CREATE TABLE IF NOT EXISTS `skills` (
    `skill_id`      int(11)         NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each skill',
    `experience_id` int(11)         NOT NULL                COMMENT 'FK: The experience id from experiences.experience_id',
    `name`          varchar(150)    NOT NULL                COMMENT 'Name of the skill',
    `skill_level`   int(2)          NOT NULL                COMMENT 'The level of the skill; 1 being worst, 10 being best',
    PRIMARY KEY (`skill_id`),
    FOREIGN KEY (`experience_id`) REFERENCES experiences(experience_id)
)   ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='Skills associated with each experience';