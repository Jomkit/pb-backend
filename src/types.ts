interface IUser {
    id?: number;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface ISurvey {
    id?: number;
    taskId: string;
    projectId: string;
    timerId: string;
    score: number;
    description?: string;
}

export type { IUser, ISurvey };