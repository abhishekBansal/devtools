import { describe, it, expect } from 'vitest';
import {
  validateCronExpression,
  explainCronExpression,
  expandCronExpression,
  CRON_PRESETS,
} from '../src/cron.js';

describe('cron utilities', () => {
  describe('validateCronExpression', () => {
    it('should validate basic cron expressions', () => {
      expect(validateCronExpression('0 0 * * *')).toEqual({ valid: true });
      expect(validateCronExpression('*/5 * * * *')).toEqual({ valid: true });
      expect(validateCronExpression('0 9 * * 1-5')).toEqual({ valid: true });
      expect(validateCronExpression('0 0 1 1 *')).toEqual({ valid: true });
    });

    it('should validate common expressions', () => {
      expect(validateCronExpression('@hourly')).toEqual({ valid: true });
      expect(validateCronExpression('@daily')).toEqual({ valid: true });
      expect(validateCronExpression('@weekly')).toEqual({ valid: true });
      expect(validateCronExpression('@monthly')).toEqual({ valid: true });
      expect(validateCronExpression('@yearly')).toEqual({ valid: true });
    });

    it('should validate ranges', () => {
      expect(validateCronExpression('0 9-17 * * *')).toEqual({ valid: true });
      expect(validateCronExpression('* * * * 1-5')).toEqual({ valid: true });
      expect(validateCronExpression('* * 1-15 * *')).toEqual({ valid: true });
    });

    it('should validate lists', () => {
      expect(validateCronExpression('0 9,12,18 * * *')).toEqual({ valid: true });
      expect(validateCronExpression('* * * * 1,3,5')).toEqual({ valid: true });
      expect(validateCronExpression('0,30 * * * *')).toEqual({ valid: true });
    });

    it('should validate step values', () => {
      expect(validateCronExpression('*/15 * * * *')).toEqual({ valid: true });
      expect(validateCronExpression('0 */2 * * *')).toEqual({ valid: true });
      expect(validateCronExpression('0 9-17/2 * * *')).toEqual({ valid: true });
    });

    it('should reject invalid expressions', () => {
      expect(validateCronExpression('')).toEqual({ 
        valid: false, 
        error: 'Cron expression is required' 
      });
      
      expect(validateCronExpression('* * *')).toEqual({ 
        valid: false, 
        error: 'Cron expression must have exactly 5 fields (minute hour day month day_of_week)' 
      });
      
      expect(validateCronExpression('60 * * * *')).toEqual({ 
        valid: false, 
        error: 'Invalid minute: Value must be between 0 and 59' 
      });
      
      expect(validateCronExpression('* 25 * * *')).toEqual({ 
        valid: false, 
        error: 'Invalid hour: Value must be between 0 and 23' 
      });
      
      expect(validateCronExpression('* * 32 * *')).toEqual({ 
        valid: false, 
        error: 'Invalid day: Value must be between 1 and 31' 
      });
      
      expect(validateCronExpression('* * * 13 *')).toEqual({ 
        valid: false, 
        error: 'Invalid month: Value must be between 1 and 12' 
      });
      
      expect(validateCronExpression('* * * * 7')).toEqual({ 
        valid: false, 
        error: 'Invalid day_of_week: Value must be between 0 and 6' 
      });
    });

    it('should reject invalid ranges', () => {
      expect(validateCronExpression('5-2 * * * *')).toEqual({ 
        valid: false, 
        error: 'Invalid minute: Range start must be less than or equal to range end' 
      });
      
      expect(validateCronExpression('* 20-10 * * *')).toEqual({ 
        valid: false, 
        error: 'Invalid hour: Range start must be less than or equal to range end' 
      });
    });

    it('should reject invalid step values', () => {
      expect(validateCronExpression('*/0 * * * *')).toEqual({ 
        valid: false, 
        error: 'Invalid minute: Step value must be a positive integer' 
      });
      
      expect(validateCronExpression('*/-1 * * * *')).toEqual({ 
        valid: false, 
        error: 'Invalid minute: Step value must be a positive integer' 
      });
    });
  });

  describe('explainCronExpression', () => {
    it('should explain common expressions', () => {
      expect(explainCronExpression('@hourly')).toBe('Once an hour at the beginning of the hour');
      expect(explainCronExpression('@daily')).toBe('Once a day at midnight');
      expect(explainCronExpression('@weekly')).toBe('Once a week at midnight on Sunday');
      expect(explainCronExpression('@monthly')).toBe('Once a month at midnight on the 1st day');
      expect(explainCronExpression('@yearly')).toBe('Once a year at midnight on January 1st');
    });

    it('should explain basic expressions', () => {
      expect(explainCronExpression('0 0 * * *')).toBe('At midnight');
      expect(explainCronExpression('0 9 * * *')).toBe('At 9:00 AM');
      expect(explainCronExpression('0 18 * * *')).toBe('At 6:00 PM');
      expect(explainCronExpression('30 14 * * *')).toBe('At 30 minutes past 2:00 PM');
    });

    it('should explain expressions with day constraints', () => {
      expect(explainCronExpression('0 9 * * 1')).toBe('At 9:00 AM on Monday');
      expect(explainCronExpression('0 9 * * 1-5')).toBe('At 9:00 AM on Monday through Friday');
      expect(explainCronExpression('0 9 1 * *')).toBe('At 9:00 AM on 1st of the month');
      expect(explainCronExpression('0 9 * 1 *')).toBe('At 9:00 AM in January');
    });

    it('should explain step expressions', () => {
      expect(explainCronExpression('*/5 * * * *')).toBe('At every 5 minutes of every hour');
      expect(explainCronExpression('0 */2 * * *')).toBe('At the beginning of every hour at every 2 hours');
    });

    it('should handle invalid expressions', () => {
      expect(explainCronExpression('')).toBe('Invalid cron expression');
      expect(explainCronExpression('invalid')).toContain('Invalid cron expression:');
    });
  });

  describe('expandCronExpression', () => {
    it('should expand common expressions', () => {
      expect(expandCronExpression('@hourly')).toBe('0 * * * *');
      expect(expandCronExpression('@daily')).toBe('0 0 * * *');
      expect(expandCronExpression('@weekly')).toBe('0 0 * * 0');
      expect(expandCronExpression('@monthly')).toBe('0 0 1 * *');
      expect(expandCronExpression('@yearly')).toBe('0 0 1 1 *');
      expect(expandCronExpression('@annually')).toBe('0 0 1 1 *');
    });

    it('should return standard expressions unchanged', () => {
      expect(expandCronExpression('0 9 * * *')).toBe('0 9 * * *');
      expect(expandCronExpression('*/5 * * * *')).toBe('*/5 * * * *');
    });
  });

  describe('CRON_PRESETS', () => {
    it('should contain common presets', () => {
      expect(CRON_PRESETS).toHaveLength(13);
      
      const presetNames = CRON_PRESETS.map(p => p.name);
      expect(presetNames).toContain('Every minute');
      expect(presetNames).toContain('Every hour');
      expect(presetNames).toContain('Every day at midnight');
      expect(presetNames).toContain('Every weekday at 9 AM');
      
      // Verify all presets have valid expressions
      CRON_PRESETS.forEach(preset => {
        const validation = validateCronExpression(preset.expression);
        expect(validation.valid).toBe(true);
      });
    });
  });
});
