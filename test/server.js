const supertest = require('supertest');
const server = require('../app/server');
const _ = require('lodash');
const sinon = require('sinon');
require('should-sinon');
const jwt = require('jsonwebtoken')


describe('Server', () => {

    const posts = {};
    const request = supertest(server(posts))
    const token = jwt.sign({name: 'user', role: 'test'}, 'some-secret')


    describe('GET /people', () => {

        const data = [{ id: 1,
                        name:'name',
                        age: 12,
                        balance: 100.00,
                        email: 'user@email.com',
                        address: 'address'}];

        before(() =>
            posts.index = () =>
                new Promise((resolve, reject) =>
                resolve(data)
                )
        );

        it('should return all posts and 200', () =>
            request
                .get('/people')
                .expect(200)
                .expect(data)
        );

        it('posts.index should be called once', () => {
            const spy = sinon.spy(posts, 'index')

            return request
                    .get('/people')
                        .then(()=>{
                        spy.should.be.calledOnce();
                    })
        })

    });

    describe('POST /people', () => {
        const id ='23';
        const data = {   name:'name',
                         age: 12,
                         balance: 100.00,
                         email: 'user@email.com',
                         address: 'address'}

        before(() =>
            posts.create = (attrs) =>
                new Promise((resolve, reject) =>
                    resolve(_.merge({id: id}, attrs))
                )
        )

        it('parses id and returns record', () =>
            request
                .post('/people')
                .send({post: data})
                .expect(201)
                .expect(_.merge({id:id}, data))
        )

        it('validate input to posts.create', () => {
            const spy = sinon.spy(posts, 'create')

            return request
                    .post('/people')
                    .send({post: data})
                .then(()=> {
                    spy.should.be.calledOnce();
                    spy.should.be.calledWith(data);
                })
        })


    })

    describe('GET a specific person', () => {

    const data = { name:'name',
        age: 12,
        balance: 100.00,
        email: 'user@email.com',
        address: 'address'};

    before(() =>
        posts.show = (id) =>
            new Promise((resolve, reject) =>
                resolve(_.merge({id: id}, data))
            )
    );


    it('responds with specific entry and 200', () =>
        request
            .get('/people/23')
            .expect(200)
            .expect(_.merge({id: 23}, data))
    );

    it('validate input to posts.show', () => {
        const spy = sinon.spy(posts, 'show')

        return request
            .get('/people/23')
            .then(()=> {
                spy.should.be.calledOnce();
                spy.should.be.calledWith('23');
            })
    })
    })

    describe('PUT /people/:id', () => {
        const data = { name:'name',
            age: 12,
            balance: 100.00,
            email: 'user@email.com',
            address: 'address'};

        before(() =>
            posts.update = (id, attrs) =>
                new Promise((resolve, reject) =>
                    resolve(_.merge({id: id}, attrs)))
        )

        it('responds with 200 and updated data', () =>
            request
                .put('/people/5')
                .send({doc: data})
                .expect(200)
                .expect(_.merge({id:5}, data))
        )

        it('validate input to posts.update', () => {
            const spy = sinon.spy(posts, 'update')

            return request
                .put('/people/23')
                .send({doc: data})
                .then(()=> {
                    spy.should.be.calledOnce();
                    spy.should.be.calledWith('23', data);
                })
        })
    })

    describe('DELETE a person', () => {

        before(() =>
            posts.destroy = (id) =>
                new Promise((resolve, reject) =>
                    resolve(id)
                )
        )

        it('Returns id and 200', () =>
            request.del('/people/5')
                .expect(200)
                .expect('5')
        )

    })

})