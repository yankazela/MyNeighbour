import { submitAddress, SUBMIT } from './home'

describe('', () => {
    it('should test if submitaddress is working', () => {
        let data = {
            address: '24 x',
            suburb: 'molo',
            city: 'city',
            country: 'country'
          } 
        const state = submitAddress(data)
        expect(state).toEqual({'type': SUBMIT, data})
    })
})