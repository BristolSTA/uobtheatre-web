import { expect } from 'chai'

import TicketsMatrix from '@/classes/TicketsMatrix'

import FakePerformance from '../fixtures/FakePerformance'
import { executeWithServer, runApolloQuery } from '../helpers'

describe('TicketsMatrix', () => {
  let matrix
  let apiData
  let performance
  beforeEach(async () => {
    await executeWithServer(async (server) => {
      performance = server.create(
        'performanceNode',
        Object.assign({}, FakePerformance(server), { capacityRemaining: 100 })
      )
      const { data } = await runApolloQuery({
        query: require('@/graphql/queries/PerformanceTicketOptions.gql'),
        variables: {
          id: performance.id,
        },
      })
      apiData = data.performance
      matrix = new TicketsMatrix(apiData)
    })
  })

  it('can get ticket options', () => {
    expect(matrix.ticketOptions).to.include(apiData.ticketOptions[0])
  })
  it('can get performance capacity remaining', () => {
    expect(matrix.performanceCapacityRemaining).to.eq(100)
  })
  it('can set performance capacity remaining', () => {
    matrix.performanceCapacityRemaining = 10
    expect(matrix.performanceCapacityRemaining).to.eq(10)
  })
  it('can decrement performance capacity remaining', () => {
    matrix.decrementPerformanceCapacity()
    expect(matrix.performanceCapacityRemaining).to.eq(99)
  })
  it('can increment performance capacity remaining', () => {
    matrix.incrementPerformanceCapacity()
    expect(matrix.performanceCapacityRemaining).to.eq(101)
  })
  it('can get capacity remaining for a seat group', () => {
    expect(matrix.capacityRemainingForSeatGroup('1')).to.eq(10)

    // Test that is uses minimum between performance and seat group
    matrix.performanceCapacityRemaining = 5

    expect(matrix.capacityRemainingForSeatGroup('1')).to.eq(5)
  })
  it('can decrement capacity remaining for a seat group', () => {
    matrix.decrementSeatGroupCapacity('1')
    expect(matrix.capacityRemainingForSeatGroup('1')).to.eq(9)
  })
  it('can increment capacity remaining for a seat group', () => {
    matrix.incrementSeatGroupCapacity('1')
    expect(matrix.capacityRemainingForSeatGroup('1')).to.eq(11)
  })
  it('can check if it can add tickets', () => {
    expect(matrix.canAddTickets(1)).to.be.true
    expect(matrix.canAddTickets(100)).to.be.true
    expect(matrix.canAddTickets(101)).to.be.false

    expect(
      matrix.canAddTickets(10, performance.ticketOptions.models[0].seatGroup.id)
    ).to.be.true
    expect(
      matrix.canAddTickets(11, performance.ticketOptions.models[0].seatGroup.id)
    ).to.be.false

    matrix.performanceCapacityRemaining = 0
    expect(
      matrix.canAddTickets(1, performance.ticketOptions.models[0].seatGroup.id)
    ).to.be.false
  })
})
