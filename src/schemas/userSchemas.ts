import * as Yup from 'yup';

const userSchema = Yup.object().shape({
    body: Yup.object().shape({
        username: Yup.string().required(),
        password: Yup.string().min(6).required(),
        firstName: Yup.string().notRequired(),
        lastName: Yup.string().notRequired(),
        email: Yup.string().email().notRequired()
    })
});

export { userSchema };