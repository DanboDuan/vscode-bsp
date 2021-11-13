'use strict';

export {
    DocumentUri,
    URI,
    integer,
    uinteger,
    decimal,
    TextDocumentIdentifier,
    Diagnostic,
    Location
} from 'vscode-languageserver-types'

export {
    Message,
    NotificationMessage,
    CancellationToken,
    RequestHandler0,
    RequestHandler,
    GenericRequestHandler,
    NotificationHandler0,
    NotificationHandler,
    GenericNotificationHandler,
    ProgressType,
    Trace,
    Tracer,
    TraceOptions,
    Disposable,
    Event,
    MessageReader,
    MessageWriter,
    Logger,
    ConnectionStrategy,
    ConnectionOptions,
    createMessageConnection,
    RequestType0,
    RequestType,
    NotificationType0,
    NotificationType,
    MessageSignature,
    ResponseError,
    _EM,
    ParameterStructures,
} from 'vscode-jsonrpc';

import { integer, uinteger, decimal, URI } from 'vscode-languageserver-types'

export type Long = number;
export declare namespace Long {
    export const MIN_VALUE = 0;
    /// 2^53 - 1
    export const MAX_VALUE = 9007199254740991;
}

export type Int = integer;

/**
* The  BSP any type
*
*  
*/
export type BSPAny = BSPObject | BSPArray | string | integer | uinteger | decimal | boolean | null;

/**
 *  BSP object definition.
 *
 *  
 */
export type BSPObject = { [key: string]: BSPAny };

/**
 *  BSP arrays.
 *
 *  
 */
export type BSPArray = BSPAny[];


export namespace MessageType {
    /** An error message. */
    export const Error = 1;
    /** A warning message. */
    export const Warning = 2;
    /** An information message. */
    export const Info = 3;
    /** A log message. */
    export const Log = 4;
}

export type MessageType = 1 | 2 | 3 | 4;


export namespace BuildTargetEventKind {
    /** The build target is new. */
    export const Created = 1;

    /** The build target has changed. */
    export const Changed = 2;

    /** The build target has been deleted. */
    export const Deleted = 3;
}

export type BuildTargetEventKind = 1 | 2 | 3;


export namespace SourceItemKind {
    /** The source item references a normal file.  */
    export const File = 1;
    /** The source item references a directory. */
    export const Directory = 2;
}

export type SourceItemKind = 1 | 2;


export interface TaskId {
    /** A unique identifier */
    id: String;

    /** The parent task ids, if any. A non-empty parents field means
     * this task is a sub-task of every parent task id. The child-parent
     * relationship of tasks makes it possible to render tasks in
     * a tree-like user interface or inspect what caused a certain task
     * execution. */
    parents?: String[];
}

export namespace StatusCode {
    /** Execution was successful. */
    export const Ok = 1;
    /** Execution failed. */
    export const Error = 2;
    /** Execution was cancelled. */
    export const Cancelled = 3;
}

export type StatusCode = 1 | 2 | 3;

export namespace TaskDataKind {
    /** `data` field must contain a CompileTask object. */
    export const CompileTask = "compile-task";

    /** `data` field must contain a CompileReport object. */
    export const CompileReport = "compile-report";

    /** `data` field must contain a TestTask object. */
    export const TestTask = "test-task";

    /** `data` field must contain a TestReport object. */
    export const TestReport = "test-report";

    /** `data` field must contain a TestStart object. */
    export const TestStart = "test-start";

    /** `data` field must contain a TestFinish object. */
    export const TestFinish = "test-finish";
}

export namespace TestStatus {
    /** The test passed successfully. */
    export const Passed = 1;

    /** The test failed. */
    export const Failed = 2;

    /** The test was marked as ignored. */
    export const Ignored = 3;

    /** The test execution was cancelled. */
    export const Cancelled = 4;

    /** The was not included in execution. */
    export const Skipped = 5;
}

export type TestStatus = 1 | 2 | 3 | 4 | 5;



export interface BuildTargetIdentifier {
    /** The target’s Uri */
    uri: URI;
}

export namespace BuildTargetDataKind {
    /** The `data` field contains a `ScalaBuildTarget` object. */
    export const Scala = "scala";

    /** The `data` field contains a `SbtBuildTarget` object. */
    export const Sbt = "sbt";
}

export namespace BuildTargetTag {
    /** Target contains re-usable functionality for downstream targets. May have any
     * combination of capabilities. */
    export const Library = "library";

    /** Target contains source code for producing any kind of application, may have
     * but does not require the `canRun` capability. */
    export const Application = "application";

    /** Target contains source code for testing purposes, may have but does not
     * require the `canTest` capability. */
    export const Test = "test";

    /** Target contains source code for integration testing purposes, may have
     * but does not require the `canTest` capability.
     * The difference between "test" and "integration-test" is that
     * integration tests traditionally run slower compared to normal tests
     * and require more computing resources to execute.
     */
    export const IntegrationTest = "integration-test";

    /** Target contains source code to measure performance of a program, may have
     * but does not require the `canRun` build target capability.
     */
    export const Benchmark = "benchmark";

    /** Target should be ignored by IDEs. */
    export const NoIDE = "no-ide";

    /** Actions on the target such as build and test should only be invoked manually
     * and explicitly. For example, triggering a build on all targets in the workspace
     * should by default not include this target.
     *
     * The original motivation to add the "manual" tag comes from a similar functionality
     * that exists in Bazel, where targets with this tag have to be specified explicitly
     * on the command line.
     */
    export const Manual = "manual";
}

export interface BuildTargetCapabilities {
    /** This target can be compiled by the BSP server. */
    canCompile: Boolean;
    /** This target can be tested by the BSP server. */
    canTest: Boolean;
    /** This target can be run by the BSP server. */
    canRun: Boolean;
    /** This target can be debugged by the BSP server. */
    canDebug: Boolean;
}
export interface BuildTarget {
    /** The target’s unique identifier */
    id: BuildTargetIdentifier;

    /** A human readable name for this target.
     * May be presented in the user interface.
     * Should be unique if possible.
     * The id.uri is used if None. */
    displayName?: String;

    /** The directory where this target belongs to. Multiple build targets are allowed to map
     * to the same base directory, and a build target is not required to have a base directory.
     * A base directory does not determine the sources of a target, see buildTarget/sources. */
    baseDirectory?: URI;

    /** Free-form string tags to categorize or label this build target.
     * For example, can be used by the client to:
     * - customize how the target should be translated into the client's project model.
     * - group together different but related targets in the user interface.
     * - display icons or colors in the user interface.
     * Pre-defined tags are listed in `BuildTargetTag` but clients and servers
     * are free to define new tags for custom purposes.
     */
    tags: String[];

    /** The capabilities of this build target. */
    capabilities: BuildTargetCapabilities;

    /** The set of languages that this target contains.
     * The ID string for each language is defined in the LSP. */
    languageIds: String[];

    /** The direct upstream build target dependencies of this build target */
    dependencies: BuildTargetIdentifier[];

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified. */
    dataKind?: String;

    /** Language-specific metadata about this target.
     * See ScalaBuildTarget as an example. */
    data?: any;
}