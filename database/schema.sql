CREATE DATABASE IF NOT EXISTS trivia_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE trivia_db;

CREATE TABLE IF NOT EXISTS trivia_questions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  question_type VARCHAR(32) NOT NULL,
  difficulty VARCHAR(32) NOT NULL,
  category VARCHAR(128) NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_trivia_questions_filters (category, difficulty, question_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wrong_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  question_id BIGINT UNSIGNED NOT NULL,
  wrong_answer TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_wrong_answers_question_id (question_id),
  CONSTRAINT fk_wrong_answers_question
    FOREIGN KEY (question_id)
    REFERENCES trivia_questions (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
