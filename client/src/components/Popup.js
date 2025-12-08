import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SecureStorage } from '../utils/encryption'
import {
  Plus,
  Copy,
  Check,
  History,
  Trash2,
  AlertCircle,
  Clipboard,
  Share2,
  Download,
  Search,
  Clock,
  Users,
  Database,
  Lock
} from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'

// const BACKEND_URL = "http://localhost:3001";
const BACKEND_URL = 'https://binstack.onrender.com';

const Popup = () => {
  const { isDark } = useTheme()
  const [content, setContent] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recentPastes, setRecentPastes] = useState([])
  const [copiedStates, setCopiedStates] = useState({})
  const [activeTab, setActiveTab] = useState('create')
  const [shareResult, setShareResult] = useState(null)
  const [importUrl, setImportUrl] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const [importedPaste, setImportedPaste] = useState(null)
  const [recentShareResults, setRecentShareResults] = useState({})
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [clipboardHistory, setClipboardHistory] = useState([])
  const [clipboardShareResults, setClipboardShareResults] = useState({})

  const themeStyles = {
    container: isDark
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
    text: isDark ? 'text-gray-100' : 'text-gray-800',
    cardBg: isDark
      ? 'bg-gray-800/80 backdrop-blur-sm'
      : 'bg-white/80 backdrop-blur-sm',
    cardBorder: isDark ? 'border-gray-700/60' : 'border-gray-200/60',
    cardShadow: isDark
      ? 'shadow-2xl shadow-gray-900/40'
      : 'shadow-xl shadow-blue-500/10',
    inputBg: isDark ? 'bg-gray-900/60' : 'bg-white/90',
    inputBorder: isDark ? 'border-gray-600/50' : 'border-gray-300/50',
    inputText: isDark
      ? 'text-gray-100 placeholder-gray-400'
      : 'text-gray-800 placeholder-gray-500',
    buttonPrimary: isDark
      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25'
      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/25',
    buttonSecondary: isDark
      ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-200 border border-gray-600/50 shadow-lg shadow-gray-900/20'
      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/60 shadow-md shadow-gray-500/10',
    tabBg: isDark ? 'from-gray-800 to-gray-900' : 'from-white to-gray-50',
    tabActive: isDark
      ? 'bg-gray-700/80 border-b-2 border-orange-500 text-orange-400 shadow-lg shadow-orange-500/20'
      : 'bg-white border-b-2 border-blue-500 text-blue-600 shadow-lg shadow-blue-500/10',
    tabInactive: isDark
      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
    headerBg: isDark
      ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-r from-white via-blue-50 to-indigo-50',
    successBg: isDark
      ? 'bg-green-900/30 backdrop-blur-sm'
      : 'bg-green-50 backdrop-blur-sm',
    successBorder: isDark ? 'border-green-700/50' : 'border-green-200/60',
    successText: isDark ? 'text-green-300' : 'text-green-800',
    successButton: isDark
      ? 'bg-green-700 hover:bg-green-600 text-white shadow-lg shadow-green-700/25'
      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25',
    shareBg: isDark
      ? 'bg-orange-900/30 backdrop-blur-sm'
      : 'bg-purple-50 backdrop-blur-sm',
    shareBorder: isDark ? 'border-orange-700/50' : 'border-purple-200/60',
    shareText: isDark ? 'text-orange-300' : 'text-purple-800',
    shareButton: isDark
      ? 'bg-orange-700 hover:bg-orange-600 text-white shadow-lg shadow-orange-700/25'
      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25',
    shareAccent: isDark ? 'text-orange-400' : 'text-purple-600',
    importBg: isDark
      ? 'bg-blue-900/30 backdrop-blur-sm'
      : 'bg-blue-50 backdrop-blur-sm',
    importBorderBorder: isDark ? 'border-blue-700/50' : 'border-blue-200/60',
    importText: isDark ? 'text-blue-300' : 'text-blue-800',
    importButton: isDark
      ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-700/25'
      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25',
    importAccent: isDark ? 'text-blue-400' : 'text-blue-600',
    encryptionBg: isDark
      ? 'bg-green-900/30 backdrop-blur-sm'
      : 'bg-green-50 backdrop-blur-sm',
    encryptionBorder: isDark ? 'border-green-700/50' : 'border-green-200/60',
    encryptionText: isDark ? 'text-green-300' : 'text-green-800'
  }

  useEffect(() => {
    chrome.storage.local.get(['recentPastes', 'clipboardHistory'], result => {
      if (result.recentPastes) {
        setRecentPastes(result.recentPastes)
      }
      if (result.clipboardHistory) {
        setClipboardHistory(result.clipboardHistory)
      }
    })
  }, [])

  useEffect(() => {
    let lastClipboardText = ''
    let clipboardCheckInterval

    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText()
        if (text && text !== lastClipboardText && text.trim().length > 0) {
          lastClipboardText = text
          setClipboardHistory(prevHistory => {
            // Avoid duplicates
            if (prevHistory.some(item => item.fullContent === text)) {
              return prevHistory
            }
            const newClipboardItem = {
              id: Date.now().toString(),
              content: text.length > 100 ? text.substring(0, 100) + '...' : text,
              fullContent: text,
              timestamp: Date.now()
            }
            const updatedHistory = [newClipboardItem, ...prevHistory].slice(0, 20)
            chrome.storage.local.set({ clipboardHistory: updatedHistory })
            return updatedHistory
          })
        }
      } catch (err) {
        console.log('Clipboard access not available:', err)
      }
    }

    clipboardCheckInterval = setInterval(checkClipboard, 1000)

    return () => {
      if (clipboardCheckInterval) {
        clearInterval(clipboardCheckInterval)
      }
    }
  }, [])

  const saveRecentPaste = paste => {
    const newPastes = [paste, ...recentPastes.slice(0, 9)]
    setRecentPastes(newPastes)
    chrome.storage.local.set({ recentPastes: newPastes })
  }

  const clearRecentPastes = () => {
    setRecentPastes([])
    setRecentShareResults({})
    chrome.storage.local.set({ recentPastes: [] })
  }

  const clearClipboardHistory = () => {
    setClipboardHistory([])
    setClipboardShareResults({})
    chrome.storage.local.set({ clipboardHistory: [] })
  }

  const handleCreateShareFromClipboard = async (clipboardItem) => {
    try {
      setIsLoading(true)
      setError('')

      // Create paste from clipboard content
      const res = await fetch(`${BACKEND_URL}/paste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: clipboardItem.fullContent, encrypted: false })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create paste.')
        setIsLoading(false)
        return
      }

      const { id } = await res.json()

      // Create share link
      const shareRes = await fetch(`${BACKEND_URL}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pasteId: id, expirationHours: 24 })
      })

      if (!shareRes.ok) {
        const data = await shareRes.json()
        setError(data.error || 'Failed to create share.')
        setIsLoading(false)
        return
      }

      const shareData = await shareRes.json()

      setClipboardShareResults({
        ...clipboardShareResults,
        [clipboardItem.id]: { ...shareData, shareUrl: shareData.shareUrl }
      })

      // Also add to recent pastes
      const newPaste = {
        id,
        content: clipboardItem.content,
        timestamp: Date.now(),
        encrypted: false
      }
      saveRecentPaste(newPaste)

      setIsLoading(false)
    } catch (err) {
      console.error('Error creating share from clipboard:', err)
      setError('Error creating share link.')
      setIsLoading(false)
    }
  }

  const getClipboardContent = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setContent(text)
    } catch (err) {
      setError('Failed to read clipboard. Please paste manually.')
    }
  }
  const handleSave = async () => {
    setError('')
    setResult(null)
    setShareResult(null)

    if (!content.trim()) {
      setError('Please enter some text.')
      return
    }

    if (new Blob([content]).size > 1024 * 1024) {
      setError('Paste too large (max 1MB).')
      return
    }

    setIsLoading(true)

    try {
      let finalContent = content
      let encryptionKey = null

      if (isEncrypted) {
        try {
          encryptionKey = SecureStorage.generateKey()
          const encryptedData = SecureStorage.encrypt(content, encryptionKey)
          finalContent = JSON.stringify(encryptedData)
        } catch (encryptError) {
          setError('Encryption failed. Please try again.')
          setIsLoading(false)
          return
        }
      }

      const res = await fetch(`${BACKEND_URL}/paste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: finalContent, encrypted: isEncrypted })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save.')
        return
      }

      const { id } = await res.json()

      if (isEncrypted && encryptionKey) {
        localStorage.setItem(`key_${id}`, encryptionKey)
      }

      const newPaste = {
        id,
        content:
          content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        timestamp: Date.now(),
        encrypted: isEncrypted
      }

      setResult({ id })
      saveRecentPaste(newPaste)
      setContent('')

      handleCreateShare(id)
    } catch (err) {
      console.error('Error:', err)
      setError('Error connecting to backend.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateShare = async pasteId => {
    try {
      const encryptionKey = localStorage.getItem(`key_${pasteId}`)

      const res = await fetch(`${BACKEND_URL}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pasteId, expirationHours: 24 })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create share.')
        return
      }

      const shareData = await res.json()

      let finalShareLink
      if (encryptionKey) {
        finalShareLink = SecureStorage.generateSecureShareLink(
          shareData.shareId,
          encryptionKey
        )
      } else {
        finalShareLink = shareData.shareUrl
      }

      setShareResult({ ...shareData, shareUrl: finalShareLink })
      setResult(null)
    } catch (err) {
      setError('Error creating share link.')
    }
  }

  const handleCreateShareFromRecent = async pasteId => {
    try {
      const encryptionKey = localStorage.getItem(`key_${pasteId}`)

      const res = await fetch(`${BACKEND_URL}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pasteId, expirationHours: 24 })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create share.')
        return
      }

      const shareData = await res.json()

      let finalShareLink
      if (encryptionKey) {
        finalShareLink = SecureStorage.generateSecureShareLink(
          shareData.shareId,
          encryptionKey
        )
      } else {
        finalShareLink = shareData.shareUrl
      }

      setRecentShareResults({
        ...recentShareResults,
        [pasteId]: { ...shareData, shareUrl: finalShareLink }
      })
    } catch (err) {
      setError('Error creating share link.')
    }
  }

  const handleImportPaste = async () => {
    setError('')
    setImportedPaste(null)

    if (!importUrl.trim()) {
      setError('Please enter a share URL.')
      return
    }

    let shareId, encryptionKey
    let shareUrlCopy = importUrl.trim()

    const isEncrypted = shareUrlCopy.includes('#')

    if (isEncrypted) {
      const parsed = SecureStorage.parseSecureShareLink(shareUrlCopy)
      shareId = parsed.shareId
      encryptionKey = parsed.key
    } else {
      if (shareUrlCopy.startsWith('pastebin:')) {
        shareId = shareUrlCopy.substring(9)
      } else {
        shareId = shareUrlCopy
      }
    }

    if (shareId.length !== 12) {
      setError('Invalid share URL format.')
      return
    }

    setImportLoading(true)

    try {
      const res = await fetch(`${BACKEND_URL}/import/${shareId}`)

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to import paste.')
        return
      }

      const importData = await res.json()

      let finalContent = importData.content

      if (isEncrypted && encryptionKey) {
        const encryptedData = JSON.parse(importData.content)
        finalContent = SecureStorage.decrypt(encryptedData, encryptionKey)
      }

      setImportedPaste({ ...importData, content: finalContent })
      setImportUrl('')
    } catch (err) {
      setError('Error importing paste.')
    } finally {
      setImportLoading(false)
    }
  }

  const useImportedPaste = () => {
    if (importedPaste) {
      setContent(importedPaste.content)
      setActiveTab('create')
      setImportedPaste(null)
    }
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates({ ...copiedStates, [key]: true })
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  return (
    <div
      className={`h-full flex flex-col overflow-hidden ${themeStyles.container}`}
    >
      {/* Header */}
      <div className={`p-6 shadow-2xl ${themeStyles.headerBg} relative`}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`w-10 h-10 rounded-xl ${
                isDark
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25'
              } flex items-center justify-center`}
            >
              <Database className='w-5 h-5 text-white' />
            </motion.div>
            <div>
              <h1 className={`text-2xl font-bold ${themeStyles.text}`}>
                BinStack
              </h1>
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Professional text sharing & storage
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <ThemeToggle />
          </motion.div>
        </div>
        {/* Decorative gradient line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${
            isDark
              ? 'bg-gradient-to-r from-orange-500 to-red-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}
        ></div>
      </div>

      {/* Tab Navigation */}
      <div
        className={`flex border-b ${themeStyles.cardBorder} bg-gradient-to-r ${themeStyles.tabBg} relative`}
      >
        <button
          onClick={() => setActiveTab('create')}
          className={clsx(
            'flex-1 py-4 px-6 text-sm font-medium transition-all duration-300 rounded-t-lg relative',
            activeTab === 'create'
              ? themeStyles.tabActive
              : themeStyles.tabInactive
          )}
        >
          <Plus className='w-4 h-4 inline mr-2' />
          Create
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={clsx(
            'flex-1 py-4 px-6 text-sm font-medium transition-all duration-300 rounded-t-lg relative',
            activeTab === 'import'
              ? themeStyles.tabActive
              : themeStyles.tabInactive
          )}
        >
          <Download className='w-4 h-4 inline mr-2' />
          Import
        </button>
        <button
          onClick={() => setActiveTab('clipboard')}
          className={clsx(
            'flex-1 py-4 px-6 text-sm font-medium transition-all duration-300 rounded-t-lg relative',
            activeTab === 'clipboard'
              ? themeStyles.tabActive
              : themeStyles.tabInactive
          )}
        >
          <Clipboard className='w-4 h-4 inline mr-2' />
          Clipboard ({clipboardHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={clsx(
            'flex-1 py-4 px-6 text-sm font-medium transition-all duration-300 rounded-t-lg relative',
            activeTab === 'recent'
              ? themeStyles.tabActive
              : themeStyles.tabInactive
          )}
        >
          <History className='w-4 h-4 inline mr-2' />
          Recent ({recentPastes.length})
        </button>
      </div>

      {/* Content Area */}
      <div className='flex-1 overflow-hidden'>
        <AnimatePresence mode='wait'>
          {activeTab === 'create' ? (
            <motion.div
              key='create'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className='h-full flex flex-col'
            >
              <div className='flex-1 overflow-y-auto p-6 flex flex-col'>
                {/* Clipboard Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className='mb-6 flex-shrink-0'
                >
                  <button
                    onClick={getClipboardContent}
                    className={`w-full py-3 px-4 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 rounded-lg ${themeStyles.buttonSecondary}`}
                  >
                    <Clipboard className='w-4 h-4' />
                    Paste from Clipboard
                  </button>
                </motion.div>

                {/* Encryption Toggle */}
                <div className='mb-6 flex-shrink-0'>
                  <label
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                      isEncrypted
                        ? themeStyles.encryptionBg +
                          ' ' +
                          themeStyles.encryptionBorder
                        : themeStyles.cardBg + ' ' + themeStyles.cardBorder
                    }`}
                  >
                    <motion.input
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type='checkbox'
                      checked={isEncrypted}
                      onChange={e => setIsEncrypted(e.target.checked)}
                      className='form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500'
                    />
                    <div className='flex items-center gap-2'>
                      <Lock
                        className={`w-4 h-4 ${
                          isEncrypted
                            ? themeStyles.encryptionText
                            : themeStyles.text
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isEncrypted
                            ? themeStyles.encryptionText
                            : themeStyles.text
                        }`}
                      >
                        End-to-End Encryption
                      </span>
                    </div>
                  </label>
                  {isEncrypted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-2 p-3 rounded-lg text-xs ${themeStyles.encryptionBg} ${themeStyles.encryptionBorder} ${themeStyles.encryptionText}`}
                    >
                      🔒 Content will be encrypted with AES-256 before storage.
                      Only you can decrypt it.
                    </motion.div>
                  )}
                </div>

                {/* Text Area */}
                <div className='flex-1 mb-6 min-h-[200px]'>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    className={`w-full h-full border-2 p-4 text-sm focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'focus:ring-orange-500 focus:border-orange-500'
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    } transition-all duration-300 resize-none rounded-lg ${
                      themeStyles.inputBg
                    } ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                    placeholder='Enter your text here...'
                    maxLength={1048576}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </div>

                {/* Character Count */}
                <div
                  className={`text-xs mb-6 flex items-center gap-2 flex-shrink-0 ${themeStyles.text}`}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-2 h-2 ${
                      isDark ? 'bg-orange-500' : 'bg-blue-500'
                    } rounded-full`}
                  ></motion.div>
                  {content.length.toLocaleString()} characters
                  {isEncrypted && (
                    <div
                      className={`flex items-center gap-1 ${themeStyles.encryptionText}`}
                    >
                      <Lock className='w-3 h-3' />
                      <span>Encrypted</span>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isLoading || !content.trim()}
                  className={clsx(
                    'w-full py-4 px-6 font-medium transition-all duration-300 flex items-center justify-center gap-2 rounded-lg flex-shrink-0',
                    isLoading || !content.trim()
                      ? `${themeStyles.buttonSecondary} opacity-50 cursor-not-allowed`
                      : `${themeStyles.buttonPrimary} hover:scale-105 hover:shadow-xl`
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className='w-5 h-5' />
                      {isEncrypted ? 'Create Encrypted Paste' : 'Create Paste'}
                    </>
                  )}
                </motion.button>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 border-2 rounded-lg text-sm flex items-center gap-2 flex-shrink-0 ${
                      isDark
                        ? 'bg-red-900/40 border-red-700/50 text-red-300'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    <AlertCircle className='w-5 h-5' />
                    {error}
                  </motion.div>
                )}

                {/* Universal Share Result */}
                {shareResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 border-2 rounded-lg flex-shrink-0 ${themeStyles.shareBg} ${themeStyles.shareBorder}`}
                  >
                    <div
                      className={`text-sm font-medium mb-3 flex items-center gap-2 ${themeStyles.shareText}`}
                    >
                      <Users className='w-4 h-4' />
                      {shareResult.shareUrl.includes('#')
                        ? '🔐 Encrypted Share Link Created!'
                        : '🔗 Universal Share Link Created!'}
                    </div>
                    <div className='flex items-center gap-2 mb-3'>
                      <input
                        type='text'
                        value={shareResult.shareUrl}
                        readOnly
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyToClipboard(shareResult.shareUrl, 'share')
                        }
                        className={`px-3 py-2 text-sm transition-all duration-300 rounded-lg ${themeStyles.shareButton}`}
                      >
                        {copiedStates.share ? (
                          <Check className='w-4 h-4' />
                        ) : (
                          <Copy className='w-4 h-4' />
                        )}
                      </motion.button>
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 ${themeStyles.shareAccent}`}
                    >
                      <Clock className='w-3 h-3' />⏰ Expires in{' '}
                      {shareResult.expirationHours} hours
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'import' ? (
            <motion.div
              key='import'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className='h-full flex flex-col'
            >
              {/* Fixed height container for import form */}
              <div className='p-6 flex-shrink-0'>
                <h3
                  className={`font-semibold mb-2 text-lg ${themeStyles.text}`}
                >
                  📥 Import Shared Paste
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Enter a universal share link to import paste content from
                  another device.
                </p>

                <div className='space-y-4'>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type='text'
                    placeholder='pastebin:abc123def456#encryptionKey or pastebin:abc123def456'
                    value={importUrl}
                    onChange={e => setImportUrl(e.target.value)}
                    className={`w-full px-4 py-3 border-2 text-sm font-mono focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'focus:ring-orange-500 focus:border-orange-500'
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    } transition-all duration-300 rounded-lg ${
                      themeStyles.inputBg
                    } ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleImportPaste}
                    disabled={importLoading || !importUrl.trim()}
                    className={clsx(
                      'w-full py-3 px-6 font-medium transition-all duration-300 flex items-center justify-center gap-2 rounded-lg',
                      importLoading || !importUrl.trim()
                        ? `${themeStyles.buttonSecondary} opacity-50 cursor-not-allowed`
                        : `${themeStyles.buttonPrimary} hover:scale-105 hover:shadow-xl`
                    )}
                  >
                    {importLoading ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Search className='w-5 h-5' />
                        Import Paste
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Scrollable area for results and errors */}
              <div className='flex-1 overflow-y-auto px-6 pb-6'>
                {/* Imported Paste Result */}
                {importedPaste && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border-2 rounded-lg ${themeStyles.importBg} ${themeStyles.importBorder}`}
                  >
                    <div
                      className={`text-sm font-medium mb-3 flex items-center gap-2 ${themeStyles.importText}`}
                    >
                      {importUrl.includes('#')
                        ? '🔐 Encrypted Paste Decrypted Successfully!'
                        : '✅ Paste Imported Successfully!'}
                    </div>
                    <div className='mb-4'>
                      <div
                        className={`text-xs mb-2 ${themeStyles.importAccent}`}
                      >
                        Preview:
                      </div>
                      <div
                        className={`p-3 border rounded-lg max-h-40 overflow-y-auto text-sm font-mono ${themeStyles.cardBg} ${themeStyles.cardBorder} ${themeStyles.text}`}
                      >
                        {importedPaste.content}
                      </div>
                    </div>
                    <div className='flex gap-2 mb-3'>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={useImportedPaste}
                        className={`flex-1 py-2 px-4 text-sm transition-all duration-300 rounded-lg ${themeStyles.buttonPrimary}`}
                      >
                        Use This Paste
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyToClipboard(importedPaste.content, 'imported')
                        }
                        className={`px-4 py-2 text-sm transition-all duration-300 rounded-lg ${themeStyles.importButton}`}
                      >
                        {copiedStates.imported ? (
                          <Check className='w-4 h-4' />
                        ) : (
                          <Copy className='w-4 h-4' />
                        )}
                      </motion.button>
                    </div>
                    <div className={`text-xs ${themeStyles.importAccent}`}>
                      📊 Access: {importedPaste.accessCount}/
                      {importedPaste.maxAccess}
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border-2 rounded-lg text-sm flex items-center gap-2 ${
                      isDark
                        ? 'bg-red-900/40 border-red-700/50 text-red-300'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    <AlertCircle className='w-5 h-5' />
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'clipboard' ? (
            <motion.div
              key='clipboard'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className='h-full flex flex-col'
            >
              {/* Clipboard History Header */}
              <div
                className={`p-4 border-b-2 flex items-center justify-between ${themeStyles.cardBorder}`}
              >
                <h3 className={`font-semibold text-lg ${themeStyles.text}`}>
                  📋 Clipboard History
                </h3>
                {clipboardHistory.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearClipboardHistory}
                    className={`transition-all duration-300 p-2 rounded-lg ${
                      isDark
                        ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/20'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className='w-5 h-5' />
                  </motion.button>
                )}
              </div>

              {/* Clipboard History List */}
              <div className='flex-1 overflow-y-auto'>
                {clipboardHistory.length === 0 ? (
                  <div
                    className={`h-full flex items-center justify-center text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <div className='text-center'>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clipboard
                          className={`w-12 h-12 mx-auto mb-4 ${
                            isDark ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      </motion.div>
                      <p className='text-lg font-medium'>No clipboard items</p>
                      <p className='text-sm mt-1'>Copy something in your browser to see it here!</p>
                    </div>
                  </div>
                ) : (
                  <div className='p-3 space-y-3'>
                    {clipboardHistory.map((item, index) => (
                      <div key={item.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 border-2 transition-all duration-300 rounded-lg cursor-pointer ${
                            themeStyles.cardBg
                          } ${themeStyles.cardBorder} ${
                            themeStyles.cardShadow
                          } ${
                            isDark ? 'hover:bg-gray-700/60' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleCreateShareFromClipboard(item)}
                        >
                          <div className='flex items-start justify-between gap-3'>
                            <div className='flex-1 min-w-0'>
                              <div
                                className={`text-sm font-mono truncate flex items-center gap-2 ${themeStyles.text}`}
                              >
                                {item.content}
                              </div>
                              <div
                                className={`text-xs mt-2 flex items-center gap-1 ${
                                  isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                <Clock className='w-3 h-3' />
                                {formatTimestamp(item.timestamp)}
                              </div>
                              <div
                                className={`text-xs mt-1 ${
                                  isDark ? 'text-gray-500' : 'text-gray-400'
                                }`}
                              >
                                Click to create shareable link
                              </div>
                            </div>
                            <div className='flex items-center gap-1'>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCreateShareFromClipboard(item)
                                }}
                                className={`p-2 transition-all duration-300 rounded-lg ${
                                  isDark
                                    ? 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/20'
                                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                                }`}
                                title='Create share link'
                              >
                                <Share2 className='w-4 h-4' />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                        {clipboardShareResults[item.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 p-4 border-2 rounded-lg ${themeStyles.shareBg} ${themeStyles.shareBorder}`}
                          >
                            <div
                              className={`text-sm font-medium mb-3 flex items-center gap-2 ${themeStyles.shareText}`}
                            >
                              <Users className='w-4 h-4' />
                              🔗 Share Link Created!
                            </div>
                            <div className='flex items-center gap-2 mb-3'>
                              <input
                                type='text'
                                value={clipboardShareResults[item.id].shareUrl}
                                readOnly
                                className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  copyToClipboard(
                                    clipboardShareResults[item.id].shareUrl,
                                    `clipboard-share-${item.id}`
                                  )
                                }
                                className={`px-3 py-2 text-sm transition-all duration-300 rounded-lg ${themeStyles.shareButton}`}
                              >
                                {copiedStates[`clipboard-share-${item.id}`] ? (
                                  <Check className='w-4 h-4' />
                                ) : (
                                  <Copy className='w-4 h-4' />
                                )}
                              </motion.button>
                            </div>
                            <div
                              className={`text-xs flex items-center gap-1 ${themeStyles.shareAccent}`}
                            >
                              <Clock className='w-3 h-3' />⏰ Expires in{' '}
                              {clipboardShareResults[item.id].expirationHours} hours
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key='recent'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className='h-full flex flex-col'
            >
              {/* Recent Pastes Header */}
              <div
                className={`p-4 border-b-2 flex items-center justify-between ${themeStyles.cardBorder}`}
              >
                <h3 className={`font-semibold text-lg ${themeStyles.text}`}>
                  📋 Recent Pastes
                </h3>
                {recentPastes.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearRecentPastes}
                    className={`transition-all duration-300 p-2 rounded-lg ${
                      isDark
                        ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/20'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className='w-5 h-5' />
                  </motion.button>
                )}
              </div>

              {/* Recent Pastes List */}
              <div className='flex-1 overflow-y-auto'>
                {recentPastes.length === 0 ? (
                  <div
                    className={`h-full flex items-center justify-center text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <div className='text-center'>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <History
                          className={`w-12 h-12 mx-auto mb-4 ${
                            isDark ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      </motion.div>
                      <p className='text-lg font-medium'>No recent pastes</p>
                      <p className='text-sm mt-1'>Create your first paste!</p>
                    </div>
                  </div>
                ) : (
                  <div className='p-3 space-y-3'>
                    {recentPastes.map((paste, index) => (
                      <div key={paste.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 border-2 transition-all duration-300 rounded-lg ${
                            themeStyles.cardBg
                          } ${themeStyles.cardBorder} ${
                            themeStyles.cardShadow
                          } ${
                            isDark ? 'hover:bg-gray-700/60' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className='flex items-start justify-between gap-3'>
                            <div className='flex-1 min-w-0'>
                              <div
                                className={`text-sm font-mono truncate flex items-center gap-2 ${themeStyles.text}`}
                              >
                                {paste.encrypted && (
                                  <Lock className='w-3 h-3 text-green-500' />
                                )}
                                {paste.content}
                              </div>
                              <div
                                className={`text-xs mt-2 flex items-center gap-1 ${
                                  isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                <Clock className='w-3 h-3' />
                                {formatTimestamp(paste.timestamp)}
                                {paste.encrypted && (
                                  <span
                                    className={`ml-2 px-2 py-1 rounded text-xs ${themeStyles.encryptionBg} ${themeStyles.encryptionText}`}
                                  >
                                    🔐 Encrypted
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className='flex items-center gap-1'>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleCreateShareFromRecent(paste.id)
                                }
                                className={`p-2 transition-all duration-300 rounded-lg ${
                                  isDark
                                    ? 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/20'
                                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                                }`}
                                title='Create share link'
                              >
                                <Share2 className='w-4 h-4' />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>

                        {/* Share Result for Recent Paste */}
                        {recentShareResults[paste.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 p-4 border-2 rounded-lg ${themeStyles.shareBg} ${themeStyles.shareBorder}`}
                          >
                            <div
                              className={`text-sm font-medium mb-3 flex items-center gap-2 ${themeStyles.shareText}`}
                            >
                              <Users className='w-4 h-4' />
                              {recentShareResults[paste.id].shareUrl.includes(
                                '#'
                              )
                                ? '🔐 Encrypted Share Link Created!'
                                : '🔗 Universal Share Link Created!'}
                            </div>
                            <div className='flex items-center gap-2 mb-3'>
                              <input
                                type='text'
                                value={recentShareResults[paste.id].shareUrl}
                                readOnly
                                className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  copyToClipboard(
                                    recentShareResults[paste.id].shareUrl,
                                    `recent-share-${paste.id}`
                                  )
                                }
                                className={`px-3 py-2 text-sm transition-all duration-300 rounded-lg ${themeStyles.shareButton}`}
                              >
                                {copiedStates[`recent-share-${paste.id}`] ? (
                                  <Check className='w-4 h-4' />
                                ) : (
                                  <Copy className='w-4 h-4' />
                                )}
                              </motion.button>
                            </div>
                            <div
                              className={`text-xs flex items-center gap-1 ${themeStyles.shareAccent}`}
                            >
                              <Clock className='w-3 h-3' />⏰ Expires in{' '}
                              {recentShareResults[paste.id].expirationHours}{' '}
                              hours
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Popup
