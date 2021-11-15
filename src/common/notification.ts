import { ProtocolNotificationType } from './messages';
import {
    BuildTargetEventKind,
    BuildTargetIdentifier,
    Long,
    MessageType,
    StatusCode,
    TaskId,
} from "./types";

import {
    TextDocumentIdentifier,
    Diagnostic,
} from './internal';

export interface DidChangeBuildTarget {
    changes: BuildTargetEvent[];
}

export interface BuildTargetEvent {
    /** The identifier for the changed build target */
    target: BuildTargetIdentifier;

    /** The kind of change for this build target */
    kind?: BuildTargetEventKind;

    /** Any additional metadata about what information changed. */
    data?: any;
}

export namespace BuildTargetChangedNotification {
    export const type = new ProtocolNotificationType<DidChangeBuildTarget, void>('buildTarget/didChange');
}


export namespace ExitBuildNotification {
    export const type = new ProtocolNotificationType<void, void>('build/exit');
}

export interface InitializedBuildParams { }

export namespace InitializedNotification {
    export const type = new ProtocolNotificationType<InitializedBuildParams, void>('build/initialized');
}


export interface ShowMessageParams {
    /** The message type. See {@link MessageType}. */
    type: MessageType;

    /** The task id if any. */
    task?: TaskId;

    /** The request id that originated this notification. */
    originId?: string;

    /** The actual message. */
    message: string;
}

export interface LogMessageParams {
    /** The message type. See {@link MessageType} */
    type: MessageType;

    /** The task id if any. */
    task?: TaskId;

    /** The request id that originated this notification. */
    originId?: string;

    /** The actual message */
    message: string;
}

export namespace ShowMessageNotification {
    export const type = new ProtocolNotificationType<ShowMessageParams, void>('build/showMessage');
}

export namespace LogMessageNotification {
    export const type = new ProtocolNotificationType<LogMessageParams, void>('build/logMessage');
}

export interface PublishDiagnosticsParams {
    /** The document where the diagnostics are published. */
    textDocument: TextDocumentIdentifier;

    /** The build target where the diagnostics origin.
     * It is valid for one text document to belong to multiple
     * build targets, for example sources that are compiled against multiple
     * platforms (JVM, JavaScript). */
    buildTarget: BuildTargetIdentifier;

    /** The request id that originated this notification. */
    originId?: string;

    /** The diagnostics to be published by the client. */
    diagnostics: Diagnostic[];

    /** Whether the client should clear the previous diagnostics
     * mapped to the same `textDocument` and `buildTarget`. */
    reset: boolean;
}

export namespace PublishDiagnosticsNotification {
    export const type = new ProtocolNotificationType<PublishDiagnosticsParams, void>('build/publishDiagnostics');
}


export interface TaskStartParams {
    /** Unique id of the task with optional reference to parent task id */
    taskId: TaskId;

    /** Timestamp of when the event started in milliseconds since Epoch. */
    eventTime?: Long;

    /** Message describing the task. */
    message?: string;

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified.
     * Kind names for specific tasks like compile, test, etc are specified in the protocol.
     */
    dataKind?: string;

    /** Optional metadata about the task.
     * Objects for specific tasks like compile, test, etc are specified in the protocol.
     */
    data?: any;
}


export namespace TaskStartedNotification {
    export const type = new ProtocolNotificationType<TaskStartParams, void>('build/taskStart');
}

export interface TaskProgressParams {
    /** Unique id of the task with optional reference to parent task id */
    taskId: TaskId;

    /** Timestamp of when the progress event was generated in milliseconds since Epoch. */
    eventTime?: Long;

    /** Message describing the task progress.
     * Information about the state of the task at the time the event is sent. */
    message?: string;

    /** If known, total amount of work units in this task. */
    total?: Long;

    /** If known, completed amount of work units in this task. */
    progress?: Long;

    /** Name of a work unit. For example, "files" or "tests". May be empty. */
    unit?: string;

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified.
     * Kind names for specific tasks like compile, test, etc are specified in the protocol.
     */
    dataKind?: string;

    /** Optional metadata about the task.
     * Objects for specific tasks like compile, test, etc are specified in the protocol.
     */
    data?: any;
}

export namespace TaskProgressNotification {
    export const type = new ProtocolNotificationType<TaskProgressParams, void>('build/taskProgress');
}

export interface TaskFinishParams {
    /** Unique id of the task with optional reference to parent task id */
    taskId: TaskId;

    /** Timestamp of the event in milliseconds. */
    eventTime?: Long;

    /** Message describing the finish event. */
    message?: string;

    /** Task completion status. */
    status: StatusCode;

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified.
     * Kind names for specific tasks like compile, test, etc are specified in the protocol.
     */
    dataKind?: string;

    /** Optional metadata about the task.
     * Objects for specific tasks like compile, test, etc are specified in the protocol.
     */
    data?: any;
}

export namespace TaskFinishNotification {
    export const type = new ProtocolNotificationType<TaskFinishParams, void>('build/taskFinish');
}