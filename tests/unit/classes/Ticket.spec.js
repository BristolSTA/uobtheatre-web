import { expect } from 'chai';

import Ticket from '@/classes/Ticket';
describe('Ticket Class', () => {
  /** @member {Ticket} */
  let ticket;

  let incorrectSeatGroup = {
    id: 1,
    name: 'Front Row',
  };
  let incorrectConcessionTypeEdge = {
    price: 200,
    concessionType: {
      id: 5,
      name: 'Child',
    },
  };

  let correctSeatGroup = {
    id: 2,
    name: 'Back Row',
  };
  let correctConcessionTypeEdge = {
    price: 100,
    concessionType: {
      id: 4,
      name: 'Adult',
    },
  };

  let ticket_options_data = [
    {
      seatGroup: incorrectSeatGroup,
      concessionTypes: [correctConcessionTypeEdge, incorrectConcessionTypeEdge],
    },
    {
      seatGroup: correctSeatGroup,
      concessionTypes: [correctConcessionTypeEdge, incorrectConcessionTypeEdge],
    },
  ];

  beforeEach(() => {
    ticket = new Ticket(
      correctSeatGroup.id,
      correctConcessionTypeEdge.concessionType.id
    );
  });

  it('can create from API data', () => {
    let ticket = Ticket.fromAPIData({
      id: 4,
      seatGroup: {
        id: 1,
      },
      concessionType: {
        id: 2,
      },
    });

    expect(ticket.id).to.eq(4);
    expect(ticket.seat_group.id).to.eq(1);
    expect(ticket.concession_type.id).to.eq(2);
  });

  it('can report if it matches', () => {
    expect(ticket.matches(incorrectSeatGroup)).to.be.false;
    expect(ticket.matches(null, incorrectConcessionTypeEdge)).to.be.false;
    expect(ticket.matches(incorrectSeatGroup, incorrectConcessionTypeEdge)).to
      .be.false;

    expect(ticket.matches(correctSeatGroup)).to.be.true;
    expect(ticket.matches(null, correctConcessionTypeEdge.concessionType)).to.be
      .true;
    expect(
      ticket.matches(correctSeatGroup, correctConcessionTypeEdge.concessionType)
    ).to.be.true;
  });

  it('can give the price in pennies', () => {
    expect(ticket.price(ticket_options_data) == 100);
  });

  it('can convert to API data', () => {
    expect(ticket.apiData).to.include({
      id: null,
      seatGroupId: 2,
      concessionTypeId: 4,
    });

    ticket.id = 2;

    expect(ticket.apiData).to.include({
      id: 2,
      seatGroupId: 2,
      concessionTypeId: 4,
    });
  });

  it('can generate a unique QR code string', () => {
    ticket.id = 2;
    expect(ticket.generateQRCodeString('abcd1234')).to.eq('YWJjZDEyMzQsMg==');
  });
});
