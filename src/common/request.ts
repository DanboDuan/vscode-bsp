import { ProtocolRequestType, ProtocolRequestType0 } from './messages';
import {
    BuildTargetIdentifier,
    SourceItemKind,
    BuildTarget,
    Int,
    Long,
    StatusCode,
    TestStatus,

} from './types';

import {
    TextDocumentIdentifier,
    Location,
    ResponseError,
    URI,
} from './internal';

export interface InitializeBuildParams {
    /** Name of the client */
    displayName: string;

    /** The version of the client */
    version: string;

    /** The BSP version that the client speaks */
    bspVersion: string;

    /** The rootUri of the workspace */
    rootUri: URI;

    /** The capabilities of the client */
    capabilities: BuildClientCapabilities;

    /** Additional metadata about the client */
    data?: any;
}

export interface BuildClientCapabilities {
    /** The languages that this client supports.
     * The ID strings for each language is defined in the LSP.
     * The server must never respond with build targets for other
     * languages than those that appear in this list. */
    languageIds: string[];
}
export interface InitializeBuildResult {
    /** Name of the server */
    displayName: string;

    /** The version of the server */
    version: string;

    /** The BSP version that the server speaks */
    bspVersion: string;

    /** The capabilities of the build server */
    capabilities: BuildServerCapabilities;

    /** Additional metadata about the server */
    data?: any;
}

export interface BuildServerCapabilities {
    /** The languages the server supports compilation via method buildTarget/compile. */
    compileProvider?: CompileProvider;

    /** The languages the server supports test execution via method buildTarget/test */
    testProvider?: TestProvider;

    /** The languages the server supports run via method buildTarget/run */
    runProvider?: RunProvider;

    /** The languages the server supports debugging via method debugSession/start */
    debugProvider?: DebugProvider;

    /** The server can provide a list of targets that contain a
     * single text document via the method buildTarget/inverseSources */
    inverseSourcesProvider?: boolean;

    /** The server provides sources for library dependencies
     * via method buildTarget/dependencySources */
    dependencySourcesProvider?: boolean;

    /** The server cam provide a list of dependency modules (libraries with meta information)
     * via method buildTarget/dependencyModules */
    dependencyModulesProvider?: boolean;

    /** The server provides all the resource dependencies
     * via method buildTarget/resources */
    resourcesProvider?: boolean;

    /** Reloading the build state through workspace/reload is supported */
    canReload?: boolean

    /** The server sends notifications to the client on build
     * target change events via buildTarget/didChange */
    buildTargetChangedProvider?: boolean;
}

export interface CompileProvider {
    languageIds: string[];
}

export interface RunProvider {
    languageIds: string[];
}

export interface DebugProvider {
    languageIds: string[];
}

export interface TestProvider {
    languageIds: string[];
}

export namespace InitializeRequest {
    export const type = new ProtocolRequestType<InitializeBuildParams, InitializeBuildResult, never, ResponseError, void>('build/initialize');
}


export namespace ShutdownRequest {
    export const type = new ProtocolRequestType0<void, never, void, void>('build/shutdown');
}


export interface ReloadParams {
    /** Kind of data to expect in the data field. If this field is not set, the kind of data is not specified. */
    dataKind?: string;
    data?: any;
}


export namespace ReloadRequest {
    export const type = new ProtocolRequestType0<ReloadParams, never, void, void>('workspace/reload');
}

export interface WorkspaceBuildTargetsParams { }

export interface WorkspaceBuildTargetsResult {
    /** The build targets in this workspace that
     * contain sources with the given language ids. */
    targets: BuildTarget[];
}

export namespace WorkspaceBuildTargetsRequest {
    export const type = new ProtocolRequestType<WorkspaceBuildTargetsParams, WorkspaceBuildTargetsResult, never, ResponseError, void>('workspace/buildTargets');
}



export interface SourcesParams {
    targets: BuildTargetIdentifier[];
}

export interface SourcesResult {
    items: SourcesItem[];
}

export interface SourcesItem {
    target: BuildTargetIdentifier;
    /** The text documents or and directories that belong to this build target. */
    sources: SourceItem[];
    /** The root directories from where source files should be relativized.
     *
     * Example: ["file:///Users/name/dev/metals/src/main/scala"]
     */
    roots?: URI[];
}

export interface SourceItem {
    /** Either a text document or a directory. A directory entry must end with a forward
     * slash "/" and a directory entry implies that every nested text document within the
     * directory belongs to this source item.
     */
    uri: URI;

    /** Type of file of the source item, such as whether it is file or directory.
     */
    kind: SourceItemKind;

    /** Indicates if this source is automatically generated by the build and is not
     * intended to be manually edited by the user. */
    generated: boolean;
}

export namespace BuildTargetSourcesRequest {
    export const type = new ProtocolRequestType<SourcesParams, SourcesResult, never, ResponseError, void>('buildTarget/sources');
}


export interface InverseSourcesParams {
    textDocument: TextDocumentIdentifier;
}

export interface InverseSourcesResult {
    targets: BuildTargetIdentifier[];
}

export namespace InverseSourcesRequest {
    export const type = new ProtocolRequestType<InverseSourcesParams, InverseSourcesResult, never, ResponseError, void>('textDocument/inverseSources');
}



export interface DependencySourcesParams {
    targets: BuildTargetIdentifier[];
}

export interface DependencySourcesResult {
    items: DependencySourcesItem[];
}

export interface DependencySourcesItem {
    target: BuildTargetIdentifier;
    /** List of resources containing source files of the
     * target's dependencies.
     * Can be source files, jar files, zip files, or directories. */
    sources: URI[];
}

/**
 * The build target dependency sources request is sent from the client to the server to query for the sources of build target 
 * dependencies that are external to the workspace. The dependency sources response must not include 
 * source files that belong to a build target within the workspace, see buildTarget/sources.
 * 
 * The server communicates during the initialize handshake whether this method is supported or not. 
 * This method can for example be used by a language server on textDocument/definition to "Go to definition" 
 * from project sources to dependency sources.
 */
export namespace DependencySourcesRequest {
    export const type = new ProtocolRequestType<DependencySourcesParams, DependencySourcesResult, never, ResponseError, void>('buildTarget/dependencySources');
}


export interface DependencyModulesParams {
    targets: BuildTargetIdentifier[];
}
export interface DependencyModulesResult {
    items: DependencyModulesItem[];
}

export interface DependencyModulesItem {
    target: BuildTargetIdentifier;
    modules: DependencyModule[];
}

export interface DependencyModule {
    /** Module name */
    name: string;

    /** Module version */
    version: string;

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified. */
    dataKind?: string;

    /** Language-specific metadata about this module.
     * See MavenDependencyModule as an example. */
    data?: any;
}

/**
 * The build target dependency modules request is sent from the client to the server to query for the libraries of build target
 * dependencies that are external to the workspace including meta information about library and their sources. 
 * It's an extended version of buildTarget/sources.
 */
export namespace DependencyModulesRequest {
    export const type = new ProtocolRequestType<DependencyModulesParams, DependencyModulesResult, never, ResponseError, void>('buildTarget/dependencyModules');
}


export interface CompileParams {
    /** A sequence of build targets to compile. */
    targets: BuildTargetIdentifier[];

    /** A unique identifier generated by the client to identify this request.
     * The server may include this id in triggered notifications or responses. */
    originId?: string;

    /** Optional arguments to the compilation process. */
    arguments?: string[];
}
export interface CompileResult {
    /** An optional request id to know the origin of this report. */
    originId?: string;

    /** A status code for the execution. */
    statusCode: StatusCode;

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified. */
    dataKind: string;

    /** A field containing language-specific information, like products
     * of compilation or compiler-specific metadata the client needs to know. */
    data?: any;
}

/**
 * The beginning of a compilation unit may be signalled to the client with a build/taskStart 
 * notification. When the compilation unit is a build target, the notification's dataKind 
 * field must be "compile-task" and the data field must include a CompileTask object:
 */
export interface CompileTask {
    target: BuildTargetIdentifier;
}

/**
 * The completion of a compilation task should be signalled with a build/taskFinish notification. 
 * When the compilation unit is a build target, the notification's dataKind field must be compile-report 
 * and the data field must include a CompileReport object:
 */
export interface CompileReport {
    /** The build target that was compiled. */
    target: BuildTargetIdentifier;

    /** An optional request id to know the origin of this report. */
    originId?: string;

    /** The total number of reported errors compiling this target. */
    errors: Int;

    /** The total number of reported warnings compiling the target. */
    warnings: Int;

    /** The total number of milliseconds it took to compile the target. */
    time?: Long;

    /** The compilation was a noOp compilation. */
    noOp?: boolean;
}

export namespace CompileRequest {
    export const type = new ProtocolRequestType<CompileParams, CompileResult, never, ResponseError, void>('buildTarget/compile');
}



export interface RunParams {
    /** The build target to run. */
    target: BuildTargetIdentifier;

    /** A unique identifier generated by the client to identify this request.
     * The server may include this id in triggered notifications or responses. */
    originId?: string;

    /** Optional arguments to the executed application. */
    arguments?: string[];

    /** Kind of data to expect in the data field. If this field is not set, the kind of data is not specified. */
    dataKind?: string;

    /** Language-specific metadata for this execution.
     * See ScalaMainClass as an example. */
    data?: any;
}

export interface RunResult {
    /** An optional request id to know the origin of this report. */
    originId?: string;

    /** A status code for the execution. */
    statusCode: Int;
}

export namespace RunRequest {
    export const type = new ProtocolRequestType<RunParams, RunResult, never, ResponseError, void>('buildTarget/run');
}


export interface DebugSessionParams {
    /** A sequence of build targets affected by the debugging action. */
    targets: BuildTargetIdentifier[],

    /** The kind of data to expect in the `data` field. */
    dataKind: string;

    /** Language-specific metadata for this execution.
     * See ScalaMainClass as an example. */
    data: any;
}

export interface DebugSessionAddress {
    /** The Debug Adapter Protocol server's connection uri */
    uri: URI;
}

export namespace DebugRequest {
    export const type = new ProtocolRequestType<DebugSessionParams, DebugSessionAddress, never, ResponseError, void>('debugSession/debug');
}


export interface TestParams {
    /** A sequence of build targets to test. */
    targets: BuildTargetIdentifier[];

    /** A unique identifier generated by the client to identify this request.
     * The server may include this id in triggered notifications or responses. */
    originId?: string;

    /** Optional arguments to the test execution engine. */
    arguments?: string[];

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified. */
    dataKind?: string;

    /** Language-specific metadata about for this test execution.
     * See ScalaTestParams as an example. */
    data?: any;
}

export interface TestResult {
    /** An optional request id to know the origin of this report. */
    originId?: string;

    /** A status code for the execution. */
    statusCode: StatusCode;

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified. */
    dataKind: string;

    /** A field containing language-specific information, like products
     * of compilation or compiler-specific metadata the client needs to know. */
    data?: any;
}

/**
 * The beginning of a testing unit may be signalled to the client with a build/taskStart 
 * notification. When the testing unit is a build target, the notification's dataKind 
 * field must be test-task and the data field must include a TestTask object.
 */
export interface TestTask {
    target: BuildTargetIdentifier;
}

/**
 * The completion of a test task should be signalled with a build/taskFinish notification. 
 * When the testing unit is a build target, the notification's dataKind field must be test-report 
 * and the data field must include a TestTask object:
 */
export interface TestReport {
    /** The build target that was compiled. */
    target: BuildTargetIdentifier;

    /** The total number of successful tests. */
    passed: Int;

    /** The total number of failed tests. */
    failed: Int;

    /** The total number of ignored tests. */
    ignored: Int;

    /** The total number of cancelled tests. */
    cancelled: Int;

    /** The total number of skipped tests. */
    skipped: Int;

    /** The total number of milliseconds tests take to run (e.g. doesn't include compile times). */
    time?: Int;
}


/**
 * The server may inform about individual tests or groups of tests in task notifications 
 * that reference the originating task in their taskId. For example, the server can send 
 * a taskStart/taskFinish for each test suite in a target, and likewise for each individual 
 * test in the suite. The server's implementation decides the granularity at which tests are reported. 
 * For example, if it only has information about all the tests in a suite at a time, it could report 
 * a TestFinish for each test once the suite is done.
 * 
 * Where applicable, notifications about tests should use the taskId to reference parent 
 * tasks so that the client's user interface can display test execution in a tree view.
 * 
 * Individual test start notifications should specify test-started in the dataKind field and 
 * include the TestStart interface and test finish notifications should specify test-finished in the 
 * dataKind field and include the TestFinish interface in the data field.
 */
export interface TestStart {
    /** Name or description of the test. */
    displayName: string;

    /** Source location of the test, as LSP location. */
    location?: Location;
}

export interface TestFinish {
    /** Name or description of the test. */
    displayName: string;

    /** Information about completion of the test, for example an error message. */
    message?: string;

    /** Completion status of the test. */
    status: TestStatus;

    /** Source location of the test, as LSP location. */
    location?: Location;

    /** Kind of data to expect in the `data` field. If this field is not set, the kind of data is not specified. */
    dataKind?: string;

    /** Optionally, structured metadata about the test completion.
     * For example: stack traces, expected/actual values. */
    data?: any;
}


export namespace TestRequest {
    export const type = new ProtocolRequestType<TestParams, TestResult, never, ResponseError, void>('buildTarget/test');
}


export interface ResourcesParams {
    targets: BuildTargetIdentifier[];
}
export interface ResourcesResult {
    items: ResourcesItem[];
}

export interface ResourcesItem {
    target: BuildTargetIdentifier;
    /** List of resource files. */
    resources: URI[];
}


export namespace ResourcesRequest {
    export const type = new ProtocolRequestType<ResourcesParams, ResourcesResult, never, ResponseError, void>('buildTarget/resources');
}

export interface CleanCacheParams {
    /** The build targets to clean. */
    targets: BuildTargetIdentifier[];
}

export interface CleanCacheResult {
    /** Optional message to display to the user. */
    message?: string;
    /** Indicates whether the clean cache request was performed or not. */
    cleaned: boolean;
}

export namespace CleanCacheRequest {
    export const type = new ProtocolRequestType<CleanCacheParams, CleanCacheResult, never, ResponseError, void>('buildTarget/cleanCache');
}