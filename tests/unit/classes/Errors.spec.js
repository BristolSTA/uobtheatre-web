import { expect } from 'chai'

import Errors from '@/classes/Errors'

describe('Errors', () => {
  let errors
  beforeEach(() => {
    errors = new Errors([
      {
        message: 'An general issue',
        __typename: 'NonFieldError',
      },
      {
        message: 'An issue with a field',
        field: 'myfield',
        __typename: 'FieldError',
      },
      {
        message: 'Another issue with a field',
        field: 'myfield',
        __typename: 'FieldError',
      },
      {
        message: 'An issue with a code',
        field: 'anotherfieldthesecond',
        code: 'something_wrong',
        __typename: 'FieldError',
      },
    ])
  })

  it('can be constructed empty', () => {
    const errors = new Errors()
    expect(errors.hasNonFieldErrors()).to.be.false
    expect(errors.nonFieldErrors).to.be.empty
  })

  it('can be constructed statically', () => {
    const errors = Errors.createFromAPI([
      {
        message: 'My Error',
        __typename: 'NonFieldError',
      },
    ])

    expect(errors.hasNonFieldErrors()).to.be.true
    expect(errors.nonFieldErrors).length(1)
  })

  it('can be reset', () => {
    errors.reset()

    expect(errors.any()).to.be.false
    expect(errors.nonFieldErrors).to.be.empty
  })

  it('can report if it has at least one error for a given field', () => {
    expect(errors.has('myfield')).to.be.true
    expect(errors.has('anotherfield')).to.be.false
  })

  it('can report if it has any errors', () => {
    expect(errors.any()).to.be.true

    errors.clear()

    expect(errors.any()).to.be.false
  })

  it('can report if it has a error by code', () => {
    expect(errors.hasCode('something_wrong')).to.be.true
    expect(errors.hasCode('something_wrong_again')).to.be.false
  })

  it('can get a fields first error', () => {
    expect(errors.first('myfield')).to.include({
      message: 'An issue with a field',
    })
  })

  it('can get all errors for a field', () => {
    const fieldErrors = errors.get('myfield')
    expect(fieldErrors).length(2)
    expect(fieldErrors[0].message).to.eq('An issue with a field')
    expect(fieldErrors[1].message).to.eq('Another issue with a field')
  })

  it('can report if it has non-field errors', () => {
    expect(errors.hasNonFieldErrors()).to.be.true
    errors.errors.non_field_errors = []
    expect(errors.hasNonFieldErrors()).to.be.false
  })

  it('can get non-field errors', () => {
    const nonFieldErrors = errors.nonFieldErrors
    expect(nonFieldErrors).length(1)
    expect(nonFieldErrors[0].message).to.eq('An general issue')
  })

  it('can get field errors', () => {
    const fieldErrors = errors.fieldErrors
    expect(fieldErrors).length(3)
    expect(fieldErrors[0].message).to.eq('An issue with a field')
  })

  it('can get all errors', () => {
    expect(errors.allErrors).length(4)
    expect(errors.allErrors).to.include.members(errors.nonFieldErrors)
    expect(errors.allErrors).to.include.members(errors.fieldErrors)
  })

  it('can record new errors', () => {
    errors.record([
      {
        message: 'A new error for an amazingfield',
        field: 'amazingfield',
        __typename: 'FieldError',
      },
      {
        message: 'A new general error',
        __typename: 'NonFieldError',
      },
    ])

    expect(errors.nonFieldErrors).length(1)
    expect(errors.nonFieldErrors[0].message).to.eq('A new general error')

    expect(errors.has('myfield')).to.be.false

    expect(errors.has('amazingfield')).to.be.true
    expect(errors.first('amazingfield').message).to.eq(
      'A new error for an amazingfield'
    )
  })

  it('can clear all current errors', () => {
    errors.clear()

    expect(errors.any()).to.be.false
  })

  it('can clear errors for a given field', () => {
    errors.clear('myfield')

    expect(errors.has('myfield')).to.be.false
    expect(errors.nonFieldErrors).length(1)
  })
})
