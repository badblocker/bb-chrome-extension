
//https://github.com/bb010g/match-pattern-to-regexp
/**
 * Transforms a valid match pattern into a regular expression
 * which matches all URLs included by that pattern.
 *
 * @param  {string}  pattern  The pattern to transform.
 * @return {RegExp}           The pattern's equivalent as a RegExp.
 * @throws {TypeError}        If the pattern is not a valid MatchPattern
 */
function matchPatternToRegexp(pattern) {
    if (pattern === '') {
        return /^(?:http|https|ws|wss|file|ftp|ftps):\/\//;
    }
  
    const schemeSegment = '(\\*|http|https|ws|wss|file|ftp|ftps)';
    const hostSegment = '(\\*|(?:\\*\\.)?(?:[^/*]+))?';
    const pathSegment = '(.*)';
    const matchPatternRegExp = new RegExp(
        `^${schemeSegment}://${hostSegment}/${pathSegment}$`
    );
  
    const match = matchPatternRegExp.exec(pattern);
    if (!match) {
        throw new TypeError(`"${pattern}" is not a valid MatchPattern`);
    }
  
    let [, scheme, host, path] = match;
    if (!host && scheme !== 'file') {
        throw new TypeError(`"${pattern}" does not have a valid host`);
    }
  
    const schemeRegex = scheme === '*' ? '(http|https|ws|wss)' : scheme;
  
    let hostRegex = '';
    if (host) {
        if (host === '*') {
            hostRegex = '[^/]+?';
        } else {
            if (host.startsWith('*.')) {
                hostRegex = '(?:[^/]+?\\.)?';
                host = host.substring(2);
            }
            hostRegex += host.replace(/\./g, '\\.');
        }
    }
  
    let pathRegex = '/?';
    if (path) {
        if (path === '*') {
            pathRegex = '(/.*)?';
        } else if (path.charAt(0) !== '/') {
            pathRegex = `/${path.replace(/\./g, '\\.').replace(/\*/g, '.*?')}`;
        }
    }
  
    const regex = `^${schemeRegex}://${hostRegex}${pathRegex}$`;
    return new RegExp(regex);
}

export default matchPatternToRegexp