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

  let ticket_types_data = [
    {
      seat_group: incorrectSeatGroup,
      concession_types: [correctConcessionType, incorrectConcessionType],
    },
    {
      seat_group: correctSeatGroup,
      concession_types: [correctConcessionType, incorrectConcessionType],
    },
  ];

  beforeEach(() => {
    ticket = new Ticket(correctSeatGroup.id, correctConcessionType.id);
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
    expect(ticket.price(ticket_types_data) == 100);
  });

  it('can convert to API data', () => {
    expect(ticket.apiData).to.include({
      seat_group_id: 2,
      concession_type_id: 4,
    });
  });
});
