import { create as _create, fetch as _fetch, update as _update, updateById as _updateById, deleteUser as _delete  } from '../services/users.service.js';

async function create(req, res, next) {
    //Checking middleware
    //console.log("request time is : ",req.requestTime);
    try {
        res.status(200).json(await _create(req.body));
    } catch (err) {
        console.error(`Error while creating user(controller)`, err.message);
        next(err);
    }
}

async function fetch(req, res, next) {
    try {
        res.status(200).json(await _fetch(req));
    } catch (err) {
        console.error(`Error while fetching users - `, err.message);
        next(err);
    }
}

async function update(req, res, next) {
    try {
        res.status(200).json(await _update(req));
    } catch (err) {
        console.error(`Error while updating users - `, err.message);
        next(err);
    }
}
async function patch(req, res, next) {
    try {
        res.status(200).json(await _updateById(req));
    } catch (err) {
        console.error(`Error while deleteing users - `, err.message);
        next(err);
    }
}
async function delete_user(req, res, next) {
    try {
        res.status(200).json(await _delete(req));
    } catch (err) {
        console.error(`Error while deleteing users - `, err.message);
        next(err);
    }
}
export default {
    create,
    fetch,
    update,
    patch,
    delete_user
};
