const fs = require('fs');
let code = fs.readFileSync('src/screens/CaseScreen.tsx', 'utf8');

const target = `                      </div>
                    </div>
                    <button
                      onClick={handleAccuse}`;

const replacement = `                      </div>
                    </div>
                    <AnimatePresence>
                      {errorMsg && activeTab === 'accuse' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-[16px] flex items-center gap-3 shadow-sm"
                        >
                          <AlertTriangle size={18} className="shrink-0" />
                          <p>{errorMsg}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={handleAccuse}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/screens/CaseScreen.tsx', code);
console.log('Patched!');
