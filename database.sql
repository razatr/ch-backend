create TABLE users(
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  name VARCHAR(127),
  surname VARCHAR(127),
  registration_data TIMESTAMP WITH TIME ZONE,
  last_active TIMESTAMP WITH TIME ZONE,
  birthday DATE,
  weight REAL,
  height REAL,
  avatar VARCHAR(255),
  is_activated BOOLEAN,
  activation_link VARCHAR(255)
);

create TABLE tokens(
  token_id SERIAL PRIMARY KEY,
  refresh_token VARCHAR(255),
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

create TABLE food_history(
  food_history_id SERIAL PRIMARY KEY,
  time TIMESTAMP WITH TIME ZONE,
  state VARCHAR(255),
  comment VARCHAR(2047),
  weight REAL,
  food_id INTEGER,
  user_id INTEGER,
  FOREIGN KEY (food_id) REFERENCES food (food_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

create TABLE food(
  food_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  calories REAL NOT NULL,
  protein REAL NOT NULL,
  fats REAL NOT NULL,
  carbs REAL NOT NULL,
  vitamins_id INTEGER,
  amino_acids_id INTEGER,
  FOREIGN KEY (vitamins_id) REFERENCES vitamins (vitamins_id),
  FOREIGN KEY (amino_acids_id) REFERENCES amino_acids (amino_acids_id)
);

create TABLE amino_acids(
  amino_acids_id SERIAL PRIMARY KEY,
  a REAL,
  b REAL,
  c REAL
);

create TABLE vitamins(
  vitamins_id SERIAL PRIMARY KEY,
  a REAL,
  b REAL,
  c REAL,
  d REAL
);

INSERT INTO food (name, calories, proteins, fats, carbs)
VALUES ('banana', 96, 1.5, 0.5, 21);

ALTER TABLE food
RENAME COLUMN protein TO proteins;

ALTER TABLE food
ADD COLUMN carbs REAL NOT NULL;

DELETE FROM food
WHERE food_id = 2;

INSERT INTO food_history (food_id, user_id, time, state, comment, weight)
VALUES (3, 4, timestamp '2024-02-06 15:00:00', 'eaten', 'Было вкусно', 150);

ALTER TABLE food_history
ALTER COLUMN time TYPE timestamp;

UPDATE food_history
SET food_id = 1
WHERE food_history_id = 3;
