import { integer, uinteger, decimal, URI } from './internal'

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

export enum MessageType {
    Error = 1,
    Warning = 2,
    Info = 3,
    Log = 4,
}

export enum BuildTargetEventKind {
    /** The build target is new. */
    Created = 1,

    /** The build target has changed. */
    Changed = 2,

    /** The build target has been deleted. */
    Deleted = 3,
}

export enum SourceItemKind {
    /** The source item references a normal file.  */
    File = 1,
    /** The source item references a directory. */
    Directory = 2,
}

export interface TaskId {
    /** A unique identifier */
    id: string;

    /** The parent task ids, if any. A non-empty parents field means
     * this task is a sub-task of every parent task id. The child-parent
     * relationship of tasks makes it possible to render tasks in
     * a tree-like user interface or inspect what caused a certain task
     * execution. */
    parents?: string[];
}

export enum StatusCode {
    /** Execution was successful. */
    Ok = 1,
    /** Execution failed. */
    Error = 2,
    /** Execution was cancelled. */
    Cancelled = 3,
}

export enum TaskDataKind {
    /** `data` field must contain a CompileTask object. */
    CompileTask = "compile-task",

    /** `data` field must contain a CompileReport object. */
    CompileReport = "compile-report",

    /** `data` field must contain a TestTask object. */
    TestTask = "test-task",

    /** `data` field must contain a TestReport object. */
    TestReport = "test-report",

    /** `data` field must contain a TestStart object. */
    TestStart = "test-start",

    /** `data` field must contain a TestFinish object. */
    TestFinish = "test-finish",
}

export enum TestStatus {
    /** The test passed successfully. */
    Passed = 1,

    /** The test failed. */
    Failed = 2,

    /** The test was marked as ignored. */
    Ignored = 3,

    /** The test execution was cancelled. */
    Cancelled = 4,

    /** The was not included in execution. */
    Skipped = 5,
}


export interface BuildTargetIdentifier {
    /** The target’s Uri */
    uri: URI;
}

export enum BuildTargetDataKind {
    /** The `data` field contains a `ScalaBuildTarget` object. */
    Scala = "scala",

    /** The `data` field contains a `SbtBuildTarget` object. */
    Sbt = "sbt",
}

export enum BuildTargetTag {
    /** Target contains re-usable functionality for downstream targets. May have any
     * combination of capabilities. */
    Library = "library",

    /** Target contains source code for producing any kind of application, may have
     * but does not require the `canRun` capability. */
    Application = "application",

    /** Target contains source code for testing purposes, may have but does not
     * require the `canTest` capability. */
    Test = "test",

    /** Target contains source code for integration testing purposes, may have
     * but does not require the `canTest` capability.
     * The difference between "test" and "integration-test" is that
     * integration tests traditionally run slower compared to normal tests
     * and require more computing resources to execute.
     */
    IntegrationTest = "integration-test",

    /** Target contains source code to measure performance of a program, may have
     * but does not require the `canRun` build target capability.
     */
    Benchmark = "benchmark",

    /** Target should be ignored by IDEs. */
    NoIDE = "no-ide",

    /** Actions on the target such as build and test should only be invoked manually
     * and explicitly. For example, triggering a build on all targets in the workspace
     * should by default not include this target.
     *
     * The original motivation to add the "manual" tag comes from a similar functionality
     * that exists in Bazel, where targets with this tag have to be specified explicitly
     * on the command line.
     */
    Manual = "manual",
}

export interface BuildTargetCapabilities {
    /** This target can be compiled by the BSP server. */
    canCompile: boolean;
    /** This target can be tested by the BSP server. */
    canTest: boolean;
    /** This target can be run by the BSP server. */
    canRun: boolean;
    /** This target can be debugged by the BSP server. */
    canDebug: boolean;
}
export interface BuildTarget {
    /** The target’s unique identifier */
    id: BuildTargetIdentifier;

    /** A human readable name for this target.
     * May be presented in the user interface.
     * Should be unique if possible.
     * The id.uri is used if None. */
    displayName?: string;

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
    tags: string[];

    /** The capabilities of this build target. */
    capabilities: BuildTargetCapabilities;

    /** The set of languages that this target contains.
     * The ID string for each language is defined in the LSP. */
    languageIds: string[];

    /** The direct upstream build target dependencies of this build target */
    dependencies: BuildTargetIdentifier[];

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified. */
    dataKind?: string;

    /** Language-specific metadata about this target.
     * See ScalaBuildTarget as an example. */
    data?: any;
}