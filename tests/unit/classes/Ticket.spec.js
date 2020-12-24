import { expect } from 'chai';

import Ticket from '@/classes/Ticket';
describe('Ticket Class', () => {
  /** @member {Ticket} */
  let ticket;

  let incorrectSeatGroup = {
    id: 1,
    name: 'Front Row',
  };
  let incorrectConcessionType = {
    id: 5,
    name: 'Child',
    price: 200,
    price_pounds: '2.00',
  };

  let correctSeatGroup = {
    id: 2,
    name: 'Back Row',
  };
  let correctConcessionType = {
    id: 4,
    name: 'Adult',
    price: 100,
    price_pounds: '1.00',
  };

  beforeEach(() => {
    ticket = new Ticket(correctSeatGroup, correctConcessionType);
  });

  it('can report if it matches', () => {
    expect(ticket.matches(incorrectSeatGroup)).to.be.false;
    expect(ticket.matches(null, incorrectConcessionType)).to.be.false;
    expect(ticket.matches(incorrectSeatGroup, incorrectConcessionType)).to.be
      .false;

    expect(ticket.matches(correctSeatGroup)).to.be.true;
    expect(ticket.matches(null, correctConcessionType)).to.be.true;
    expect(ticket.matches(correctSeatGroup, correctConcessionType)).to.be.true;
  });

  it('can give the price in pennies', () => {
    expect(ticket.price == 100);
  });

  it('can give the price in pounds', () => {
    expect(ticket.price_pounds == '1.00');
  });

  it('can convert to API schema', () => {
    expect(ticket.apiSchema).to.include({
      seat_group_id: 2,
      concession_type_id: 4,
    });
  });
});
