import * as Yup from 'yup';

const createTimerSchema = Yup.object().shape({
    body: Yup.object().shape({
        userId: Yup.string().required(),
        data: Yup.object().shape({
            start: Yup.string().required(),
            end: Yup.string().notRequired(),
            projectId: Yup.string().required(),
            taskId: Yup.string().required()
        })
    })
});

export { createTimerSchema };