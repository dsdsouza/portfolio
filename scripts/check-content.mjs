import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/projects.js';
import { experience } from '../src/data/experience.js';
import { profile } from '../src/data/profile.js';
import { memories } from '../src/data/memories.js';
import { education } from '../src/data/education.js';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const requireText = (value, label) => assert.ok(typeof value === 'string' && value.trim(), `${label} must contain text`);
function unique(entries, key) {
  const values = entries.map((entry) => entry[key]);
  assert.equal(new Set(values).size, values.length, `Duplicate ${key}; each entry needs a unique value`);
}
function checkStrings(items, label) {
  if (items === undefined) return;
  assert.ok(Array.isArray(items), `${label} must be an array`);
  for (const item of items) { requireText(item, label); assert.equal(item, item.trim(), `${label} has extra whitespace`); }
  assert.equal(new Set(items.map((item) => item.toLowerCase())).size, items.length, `${label} has duplicate values`);
}
function checkSections(sections = [], label) {
  assert.ok(Array.isArray(sections), `${label} sections must be an array`);
  unique(sections, 'title');
  for (const section of sections) {
    requireText(section.title, `${label} section title`);
    if (section.text !== undefined) requireText(section.text, `${label} section text`);
    checkStrings(section.items, `${label} section items`);
  }
}
function checkLinks(links = []) {
  for (const link of links) {
    requireText(link.label, 'Link label');
    requireText(link.href, 'Link URL');
    const url = new URL(link.href, 'http://localhost:5173');
    assert.ok(['https:', 'http:', 'mailto:'].includes(url.protocol), `Unsupported link: ${link.href}`);
    if (link.href.startsWith('/')) assert.ok(existsSync(publicDir + link.href), `Missing local link: ${link.href}`);
  }
}
function checkGallery(images, label) {
  if (images === undefined) return;
  assert.ok(Array.isArray(images), `${label} images must be an array`);
  for (const image of images) {
    requireText(image.alt, `${label} image description`);
    requireText(image.src, `${label} image source`);
    assert.ok(image.src.startsWith('/') && !image.src.includes('..'), 'Gallery images must be local');
    assert.ok(/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(image.src), 'Use an image asset in galleries');
    assert.ok(existsSync(publicDir + image.src), `Missing gallery image: ${image.src}`);
    assert.ok(image.width > 0 && image.height > 0, `Missing gallery dimensions: ${image.src}`);
  }
}
unique(projects, 'slug');
for (const project of projects) {
  for (const key of ['slug', 'title', 'summary']) requireText(project[key], `Project ${key}`);
  assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid project slug: ${project.slug}`);
  if (project.logo) assert.ok(existsSync(publicDir + project.logo), `Missing project logo: ${project.logo}`);
  if (project.image) {
    assert.ok(project.image.startsWith('/assets/projects/') && !project.image.includes('..'), `Use a local /assets/projects/ image for ${project.slug}`);
    assert.ok(existsSync(publicDir + project.image), `Missing image for ${project.slug}`);
    requireText(project.imageAlt, `${project.slug} image description`);
    assert.ok(project.imageWidth > 0 && project.imageHeight > 0, `Add image dimensions for ${project.slug}`);
  }
  checkGallery(project.images, project.title);
  checkStrings(project.technologies, `${project.title} technologies`);
  checkSections(project.sections, project.title);
  checkLinks(project.links);
}
unique(experience, 'id');
const workKeys = experience.flatMap((entry) => [entry.id, ...(entry.aliases || [])]);
assert.equal(new Set(workKeys).size, workKeys.length, 'Work aliases must not collide with other aliases or IDs');
for (const entry of experience) {
  for (const key of ['id', 'organization', 'role', 'period', 'summary']) requireText(entry[key], `Experience ${key}`);
  assert.match(entry.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid work id: ${entry.id}`);
  for (const field of ['details', 'skills', 'technologies', 'leadership']) {
    if (entry[field] !== undefined) {
      assert.ok(Array.isArray(entry[field]), `Experience ${field} must be an array`);
      for (const item of entry[field]) requireText(item, `Experience ${field} item`);
    }
  }
  checkLinks([{ label: entry.organization, href: entry.website }]);
  if (entry.logo) assert.ok(existsSync(publicDir + entry.logo), `Missing organization logo: ${entry.logo}`);
  checkGallery(entry.images, entry.organization);
  checkSections(entry.sections, entry.organization);
  unique(entry.roles || [], 'id');
  for (const role of entry.roles || []) {
    checkSections(role.sections, role.title);
    for (const key of ['id', 'title', 'period', 'summary']) requireText(role[key], `Work role ${key}`);
    for (const key of ['details', 'skills', 'technologies', 'leadership']) {
      assert.ok(Array.isArray(role[key]), `Work role ${key} must be an array`);
      for (const item of role[key]) requireText(item, `Work role ${key} item`);
    }
    for (const slug of role.projectSlugs || []) assert.ok(projects.some((project) => project.slug === slug), `Unknown role project: ${slug}`);
  }
  for (const slug of entry.projectSlugs || []) assert.ok(projects.some((project) => project.slug === slug), `Unknown related project: ${slug}`);
}
unique(education, 'id');
for (const entry of education) {
  for (const key of ['id', 'school', 'period']) requireText(entry[key], `Education ${key}`);
  if (entry.degree !== undefined) requireText(entry.degree, 'Education degree');
  checkLinks([{ label: entry.school, href: entry.website }]);
  if (entry.logo) assert.ok(existsSync(publicDir + entry.logo), `Missing school logo: ${entry.logo}`);
  for (const fact of entry.facts || []) { requireText(fact.label, 'Fact label'); requireText(fact.value, 'Fact value'); }
  checkSections(entry.sections, entry.school);
}
requireText(profile.name, 'Profile name');
checkLinks(profile.links);
unique(profile.emails, 'address');
for (const email of profile.emails) { requireText(email.label, 'Email label'); assert.match(email.address, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'); }
assert.ok(existsSync(publicDir + decodeURIComponent(profile.resume)), 'The résumé PDF is missing');
if (profile.portrait) assert.ok(existsSync(publicDir + profile.portrait.src), 'The profile portrait is missing');
console.log(`Content checked: ${projects.length} projects, ${experience.length} positions, ${education.length} education entries, links and local assets.`);

unique(memories, 'id');
for (const memory of memories) {
  for (const key of ['id', 'title', 'description', 'experience']) requireText(memory[key], `Memory ${key}`);
  assert.ok(Array.isArray(memory.photos), 'Memory photos must be an array; use an empty array until photos are supplied');
  if (memory.thumbnail) checkGallery([memory.thumbnail], `${memory.title} thumbnail`);
  for (const photo of memory.photos) {
    requireText(photo.alt, 'Memory photo description');
    requireText(photo.src, 'Memory photo source');
    if (photo.src) {
      assert.ok(/^\/assets\/(memories|projects)\//.test(photo.src) && !photo.src.includes('..'), 'Use local memory photos or shared project screenshots');
      assert.ok(existsSync(publicDir + photo.src), `Missing memory photo: ${photo.src}`);
      assert.ok(photo.width > 0 && photo.height > 0, 'Memory photo dimensions are required');
    }
  }
}
console.log(`Memories checked: ${memories.length} entries.`);
