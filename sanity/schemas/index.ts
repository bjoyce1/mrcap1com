/**
 * Sanity Studio schema index
 * Import this in your sanity.config.ts:
 *   import { schemaTypes } from "./schemas";
 *   schema: { types: schemaTypes }
 */
import blogPost from "./blogPost";
import event from "./event";
import pressEntry from "./pressEntry";
import release from "./release";

export const schemaTypes = [blogPost, event, pressEntry, release];
