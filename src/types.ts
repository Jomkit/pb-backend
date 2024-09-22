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

interface ITaskData {
    name: string;
    status?: string;
    estimate?: string;
}

interface IProjectData {
    name: string; 
    note?: string;
    archived?: boolean;
}

export type { IUser, ISurvey, ITaskData, IProjectData };