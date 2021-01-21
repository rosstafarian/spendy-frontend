import React from 'react'
import PropTypes from 'prop-types'
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
import { AvForm, AvInput } from 'availity-reactstrap-validation'
import { useAuth0 } from '@auth0/auth0-react'
import { config } from '../../config'
import { showToast } from 'utils'
import { useTranslation } from 'react-i18next'

const getQuery = variables => {
    return {
        query: `
            mutation updateExpense(
                $id: String!
                $reason: String!
                $date: DateTime!
                $price: Float!
                $place: String!
                $recurUntil: DateTime
                $recurring: Boolean!
                $budget: String!
            ) {
                updateExpense(
                    id: $id
                    date: $date
                    price: $price
                    place: $place
                    reason: $reason
                    recurUntil: $recurUntil
                    recurring: $recurring
                    budget: $budget
                ) {
                    _id
                    date
                    place
                    price
                    reason
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

const EditExpenseModal = props => {
    const { isOpen, toggle, budgets, currentBudget, expense } = props
    const { t } = useTranslation()
    const { getAccessTokenSilently } = useAuth0()

    const updateExpense = async variables => {
        const token = await getAccessTokenSilently()
        const query = getQuery(variables)
        const response = await fetch(config.backend.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(query),
        })
        const result = await response.json()
        if (result.errors) {
            showToast('error', result.errors[0].message)
        } else {
            showToast('success', t('Expense updated!'))
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
                            updateExpense({
                                id: expense._id,
                                date: date.value,
                                budget: budget.value,
                                place: place.value,
                                price: parseFloat(price.value),
                                reason: reason.value,
                                recurUntil: null,
                                recurring: false,
                            })
                            toggle()
                        }}
                    >
                        <ModalHeader toggle={toggle}>
                            {t('Edit Expense')}
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
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="success">
                                {t('Save')}
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

EditExpenseModal.propTypes = {
    toggle: PropTypes.func,
    isOpen: PropTypes.bool,
}

export default EditExpenseModal