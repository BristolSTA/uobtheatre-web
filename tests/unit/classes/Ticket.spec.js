import { describe, expect, it, beforeEach } from 'vitest';
import Ticket from '~~/classes/Ticket';
describe('Ticket Class', () => {
  /** @member {Ticket} */
  let ticket;

  const incorrectSeatGroup = {
    id: 1,
    name: 'Front Row'
  };
  const incorrectConcessionTypeEdge = {
    price: 200,
    concessionType: {
      id: 5,
      name: 'Child'
    }
  };

  const correctSeatGroup = {
    id: 2,
    name: 'Back Row'
  };
  const correctConcessionTypeEdge = {
    price: 100,
    concessionType: {
      id: 4,
      name: 'Adult'
    }
  };

  const ticketOptionsData = [
    {
      seatGroup: incorrectSeatGroup,
      concessionTypes: [correctConcessionTypeEdge, incorrectConcessionTypeEdge]
    },
    {
      seatGroup: correctSeatGroup,
      concessionTypes: [correctConcessionTypeEdge, incorrectConcessionTypeEdge]
    }
  ];

  beforeEach(async () => {
    ticket = new Ticket(
      correctSeatGroup.id,
      correctConcessionTypeEdge.concessionType.id
    );
  });

  it('can create from API data', () => {
    const ticket = Ticket.fromAPIData({
      id: 4,
      seatGroup: {
        id: 1
      },
      concessionType: {
        id: 2
      }
    });

    expect(ticket.id).to.eq(4);
    expect(ticket.seatGroup.id).to.eq(1);
    expect(ticket.concessionType.id).to.eq(2);
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
    expect(ticket.price(ticketOptionsData) === 100);
  });

  it('can convert to API data', () => {
    expect(ticket.apiData).to.include({
      seatGroupId: 2,
      concessionTypeId: 4
    });

    ticket.id = 2;

    expect(ticket.apiData).to.include({
      id: 2,
      seatGroupId: 2,
      concessionTypeId: 4
    });
  });

  it('can generate a QR code string', () => {
    ticket.id = 2;
    expect(ticket.generateQRCodeString('abcd1234')).to.eq(
      'WyJhYmNkMTIzNCIsMl0='
    );
  });

  it('can get data from a QR code', () => {
    expect(Ticket.dataFromQRCode('WyJhYmNkMTIzNCIsMl0=')).to.include({
      bookingReference: 'abcd1234',
      ticketId: 2
    });
  });
});
