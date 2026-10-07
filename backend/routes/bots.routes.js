const express = require('express');
const router = express.Router();
const { inMemoryClients, inMemoryMigrations } = require('../config/db');

// GET /api/bots/migrations - Get migration audit history
router.get('/migrations', (req, res) => {
  res.json({
    success: true,
    migrations: inMemoryMigrations
  });
});

// POST /api/bots/migrate - Execute Bot Migration between clients
router.post('/migrate', (req, res) => {
  const {
    sourceClientId,
    targetClientId,
    botName,
    migrationMode,
    executedBy
  } = req.body;

  const source = inMemoryClients.find(c => c.id === parseInt(sourceClientId, 10));
  const target = inMemoryClients.find(c => c.id === parseInt(targetClientId, 10));

  if (!source || !target) {
    return res.status(400).json({ success: false, message: 'Invalid source or target client' });
  }

  const newMigration = {
    id: inMemoryMigrations.length + 1,
    migration_uuid: 'mig_' + Date.now().toString(36),
    bot_id: Math.floor(100 + Math.random() * 900),
    bot_name: botName || `${source.name} Primary Bot`,
    source_client_id: source.id,
    source_client_name: source.name,
    target_client_id: target.id,
    target_client_name: target.name,
    migration_mode: migrationMode || 'Clone Template',
    status: 'Completed',
    executed_by: executedBy || 'Sukanya Nagireddy',
    flows_included: 28,
    intents_count: 110,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  inMemoryMigrations.unshift(newMigration);
  target.bots_count = (target.bots_count || 1) + 1;

  res.status(201).json({
    success: true,
    message: `Bot '${newMigration.bot_name}' successfully migrated to ${target.name}`,
    migration: newMigration
  });
});

// POST /api/bots/migrations/:id/rollback - Rollback migration
router.post('/migrations/:id/rollback', (req, res) => {
  const mig = inMemoryMigrations.find(m => m.id === parseInt(req.params.id, 10));
  if (!mig) {
    return res.status(404).json({ success: false, message: 'Migration record not found' });
  }

  mig.status = 'Rolled Back';
  res.json({
    success: true,
    message: `Migration of ${mig.bot_name} has been rolled back.`,
    migration: mig
  });
});

module.exports = router;
