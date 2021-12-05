import {
    URI,
} from './internal';

// TODO:add more

/**
 * JvmBuildTarget is a basic data structure that contains jvm-specific metadata, specifically JDK reference. 
 * This metadata is embedded in the data: Option[Json] field of the BuildTarget definition, 
 * when the dataKind field contains "jvm"
 */
export interface JvmBuildTarget {
    /** Uri representing absolute path to jdk
     * For example: file:///usr/lib/jvm/java-8-openjdk-amd64 */
    javaHome?: URI;

    /** The java version this target is supposed to use.
     * For example: 1.8 */
    javaVersion?: string;
}