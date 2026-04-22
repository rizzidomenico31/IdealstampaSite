const reviewsService = require('../services/reviews.service');

async function list(req, res, next) {
    try {
        const { source, data } = await reviewsService.getReviews();
        res.json({ success: true, source, data });
    } catch (err) {
        next(err);
    }
}

function refreshCache(req, res) {
    reviewsService.clearCache();
    res.json({
        success: true,
        message: 'Cache azzerata, prossima richiesta recupererà dati freschi da Google'
    });
}

module.exports = { list, refreshCache };
