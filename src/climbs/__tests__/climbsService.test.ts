import * as fc from 'fast-check';
import { climbsService } from '../climbsService';
import { climbsRepository } from '../climbsRepository';
import { ClimbInput } from '../types';

jest.mock('../climbsRepository', () => ({
  climbsRepository: {
    insert: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
  },
}));

const validInput: ClimbInput = {
  routeName: 'Test Route',
  grade: 'V5',
  date: '2026-04-16',
  result: 'sent',
};

beforeEach(() => jest.clearAllMocks());

describe('climbsService.addClimb', () => {
  it('assigns a UUID and createdAt on every new climb', async () => {
    const climb = await climbsService.addClimb(validInput);
    expect(climb.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(climb.createdAt).toBeTruthy();
    expect(new Date(climb.createdAt).toISOString()).toBe(climb.createdAt);
  });

  it('delegates grade classification to GradeUtils', async () => {
    const climb = await climbsService.addClimb(validInput);
    expect(climb.gradeSystem).toBe('v-scale');
    expect(climb.gradeWarning).toBe(false);
  });

  it('stores unknown grade with warning flag', async () => {
    const climb = await climbsService.addClimb({ ...validInput, grade: '6a+' });
    expect(climb.gradeSystem).toBe('unknown');
    expect(climb.gradeWarning).toBe(true);
  });

  it.each([
    [{ ...validInput, routeName: '' }, 'routeName'],
    [{ ...validInput, routeName: '   ' }, 'routeName'],
    [{ ...validInput, grade: '' }, 'grade'],
    [{ ...validInput, date: '' }, 'date'],
    [{ ...validInput, result: undefined as unknown as 'sent' }, 'result'],
  ])('rejects missing required field: %s', async (input, field) => {
    await expect(climbsService.addClimb(input)).rejects.toMatchObject({
      errors: { [field]: 'required' },
    });
  });

  // Property 4: persistence round-trip
  it('Property 4: addClimb persists climb via repository', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          routeName: fc.string({ minLength: 1 }).map((s) => s.trim()).filter((s) => s.length > 0),
          grade: fc.constantFrom('V3', 'V7', '5.10a', 'custom'),
          date: fc.constant('2026-04-16'),
          result: fc.constantFrom('sent' as const, 'attempt' as const),
        }),
        async (input) => {
          await climbsService.addClimb(input);
          expect(climbsRepository.insert).toHaveBeenCalled();
        }
      ),
      { numRuns: 50 }
    );
  });
});
