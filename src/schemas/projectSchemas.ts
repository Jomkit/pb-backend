import * as Yup from 'yup';

const createProjectSchema = Yup.object().shape({
    body: Yup.object().shape({
        userId: Yup.string().required(),
        data: Yup.object().shape({
            name: Yup.string().min(3).required(),
            note: Yup.string().notRequired(),
            estimate: Yup.object().notRequired()
        })
    })
});

const updateProjectSchema = Yup.object().shape({
    body: Yup.object().shape({
        name: Yup.string().min(3).required(),
        note: Yup.string().notRequired()
    })
});

export { createProjectSchema, updateProjectSchema };