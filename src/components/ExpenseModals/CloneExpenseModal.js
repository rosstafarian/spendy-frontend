/* eslint-disable no-undef */
import { useAuth0 } from '@auth0/auth0-react'
import ReactTagInput from '@pathofdev/react-tag-input'
import { AvForm, AvInput } from 'availity-reactstrap-validation'
import { config } from 'config'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from 'reactstrap'
import { showToast } from 'utils'

import '@pathofdev/react-tag-input/build/index.css'
import './modal.scss'

const getQuery = variables => {
    return {
        query: `
            mutation createExpense(
                $reason: String!
                $date: DateTime!
                $price: Float!
                $place: String!
                $recurUntil: DateTime
                $recurring: Boolean!
                $tags: [String!]
                $budget: String!
            ) {
                createExpense(
                    date: $date
                    price: $price
                    place: $place
                    reason: $reason
                    recurUntil: $recurUntil
                    recurring: $recurring
                    tags: $tags
                    budget: $budget
                ) {
                    _id
                    date
                    place
                    price
                    reason
                    recurUntil
                    recurring
                    tags
                    budget(populate: true) {
                        _id
                        name
                        amount
                    }
                }
            }
        `,
        variables,
    }
}

const getFormattedDate = date => {
    return new Date(date.getTime()).toISOString().substr(0, 10)
}

const CloneExpenseModal = props => {
    const { isOpen, toggle, budgets, currentBudget, expense } = props
    const { t } = useTranslation()
    const { getAccessTokenSilently } = useAuth0()
    const [tags, setTags] = useState([])

    useEffect(() => {
        if (expense) setTags(expense.tags)
    }, [expense])

    const createExpense = async variables => {
        const token = await getAccessTokenSilently()
        const query = getQuery(variables)
        const response = await fetch(config.backend.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(query),
        })
        const result = await response.json()
        if (result.errors) {
            showToast('error', result.errors[0].message)
        } else {
            showToast('success', t('Expense created!'))
        }
    }

    const options = budgets.map(budget => (
        <option key={budget._id} value={budget._id}>
            {budget.name}
        </option>
    ))

    return (
        <Modal
            isOpen={isOpen}
            role="dialog"
            autoFocus={true}
            centered={true}
            className="exampleModal"
            tabIndex="-1"
            toggle={toggle}
        >
            {expense && (
                <div className="modal-content">
                    <AvForm
                        className="needs-validation"
                        onSubmit={e => {
                            e.preventDefault()
                            createExpense({
                                date: date.value,
                                budget: budget.value,
                                place: place.value,
                                price: parseFloat(price.value),
                                reason: reason.value,
                                recurUntil: null,
                                recurring: false,
                                tags,
                            })
                            toggle()
                        }}
                    >
                        <ModalHeader toggle={toggle}>
                            {t('Create Expense')}
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="date">{t('Date')}</Label>
                                <Input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    defaultValue={getFormattedDate(
                                        new Date(expense.date),
                                    )}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="budget">{t('Budget')}</Label>
                                <select
                                    className="form-control"
                                    id="budget"
                                    defaultValue={currentBudget._id}
                                    required
                                >
                                    {options}
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="place">{t('Place')}</Label>
                                <AvInput
                                    name="place"
                                    type="text"
                                    className="form-control"
                                    id="place"
                                    placeholder={t('Where was the expense?')}
                                    value={expense.place}
                                    errorMessage="Enter Expense Place"
                                    validate={{ required: { value: true } }}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="price">{t('Price')}</Label>
                                <AvInput
                                    name="price"
                                    type="text"
                                    className="form-control"
                                    id="price"
                                    placeholder={t('How much was it?')}
                                    value={expense.price}
                                    errorMessage="Enter Expense Price"
                                    validate={{ required: { value: true } }}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="reason">{t('Reason')}</Label>
                                <AvInput
                                    name="reason"
                                    type="textarea"
                                    className="form-control"
                                    id="reason"
                                    placeholder={t(
                                        '(Optional) Enter a reason or description',
                                    )}
                                    value={expense.reason}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="tags">{t('Tags')}</Label>
                                <ReactTagInput
                                    id="tags"
                                    tags={tags}
                                    maxTags={5}
                                    placeholder={t('Type and press enter')}
                                    removeOnBackspace
                                    onChange={newTags => setTags(newTags)}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="success">
                                {t('Create')}
                            </Button>
                            <Button
                                type="button"
                                color="secondary"
                                onClick={toggle}
                            >
                                {t('Cancel')}
                            </Button>
                        </ModalFooter>
                    </AvForm>
                </div>
            )}
        </Modal>
    )
}

CloneExpenseModal.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    budgets: PropTypes.array,
    currentBudget: PropTypes.object,
    expense: PropTypes.object,
}

export default CloneExpenseModal
