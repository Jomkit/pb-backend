-- both test users have password 'password'

INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('testuser',
        '$2b$12$iKdUuYVVunWe00Ty6n83UOo19zzQhoK24FdjTAQ8buyC.T5TLg5zS',
        'Test',
        'User',
        'test@example.com'
        ),
        ('testuser2',
        '$2b$12$iKdUuYVVunWe00Ty6n83UOo19zzQhoK24FdjTAQ8buyC.T5TLg5zS',
        'Test2',
        'User2',
        'test2@example.com'
        )
        ;