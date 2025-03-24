import { check, validationResult } from 'express-validator';

export const validateProduct = () => [
    // Validaciones para cada campo
    check('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),
    
    check('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string'),
    
    check('code')
        .notEmpty().withMessage('Code is required')
        .isString().withMessage('Code must be a string'),
    
    check('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    check('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    check('category')
        .notEmpty().withMessage('Category is required')
        .isString().withMessage('Category must be a string'),
    (req, res, next)=>{
        try {
            validationResult(req).throw()
            return next()
        } catch (e) {
            res.status(400).json({status: "Error", message: e})
        }
    }
];

export const validateUpdateProduct = () => [
    check('title').optional().isString().withMessage('Title must be a string'),
    check('description').optional().isString().withMessage('Description must be a string'),
    check('code').optional().isString().withMessage('Code must be a string'),
    check('category').optional().isString().withMessage('Category must be a string'),
    check('price').optional().isNumeric().withMessage('Price must be a number'),
    check('stock').optional().isNumeric().withMessage('Stock must be a number'),
    check('price').optional().custom(value => value >= 0).withMessage('Price must be a positive number'),
    check('stock').optional().custom(value => value >= 0).withMessage('Stock must be a positive number'),
    (req, res, next)=>{
        try {
            validationResult(req).throw()
            return next()
        } catch (e) {
            res.status(400).json({status: "Error", message: e})
        }
    }
];