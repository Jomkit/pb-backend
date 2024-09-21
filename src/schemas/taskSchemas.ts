import * as Yup from 'yup';

const createTaskSchema = Yup.object().shape({
    body: Yup.object().shape({
        userId: Yup.string().required(),
        data: Yup.object().shape({
            name: Yup.string().min(3).required(),
            status: Yup.mixed().oneOf(["ACTIVE", "DONE", "ALL"]).notRequired(),
            estimate: Yup.string().notRequired()
        })
    })
});

export { createTaskSchema };