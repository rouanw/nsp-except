import expect from 'expect.js';
import getUnknownVulnerabilities from '../../lib/get-unknown-vulnerabilities';
import { greatLib1, greatLib2, superStuff1, superStuff2, superStuff3, superStuff4 } from './data';

describe('Get Unknown Vulnerabilities', () => {
  it('returns all vulnerabilities if no exceptions are provided', () => {
    const vulnerabilities = [greatLib1, greatLib2, superStuff1];
    const exceptions = [];
    expect(getUnknownVulnerabilities({ vulnerabilities, exceptions })).to.eql(vulnerabilities);
  });

  it('treats a vulnerability as known if the path, id, and advisory match exactly', () => {
    const vulnerabilities = [greatLib1, greatLib2, superStuff1];
    const exceptions = [superStuff1];
    expect(getUnknownVulnerabilities({ vulnerabilities, exceptions })).to.eql([greatLib1, greatLib2]);
  });

  it('treats a vulnerability as unknown if the id and advisory match, but not the path', () => {
    const vulnerabilities = [greatLib1, greatLib2, superStuff1];
    const exceptions = [superStuff2];
    expect(getUnknownVulnerabilities({ vulnerabilities, exceptions })).to.eql(vulnerabilities);
  });

  it('treats a vulnerability as unknown if the path and advisory match, but not the id', () => {
    const vulnerabilities = [greatLib1, greatLib2, superStuff1];
    const exceptions = [superStuff3];
    expect(getUnknownVulnerabilities({ vulnerabilities, exceptions })).to.eql(vulnerabilities);
  });

  it('treats a vulnerability as unknown if the path and id match, but not the advisory', () => {
    const vulnerabilities = [greatLib1, greatLib2, superStuff1];
    const exceptions = [superStuff4];
    expect(getUnknownVulnerabilities({ vulnerabilities, exceptions })).to.eql(vulnerabilities);
  });

  it('recognizes a vulnerability as known, even if exceptions also contains some partial matches', () => {
    const vulnerabilities = [greatLib1, greatLib2, superStuff1];
    const exceptions = [superStuff2, superStuff3, superStuff4, superStuff1];
    expect(getUnknownVulnerabilities({ vulnerabilities, exceptions })).to.eql([greatLib1, greatLib2]);
  });
});
